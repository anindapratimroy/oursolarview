const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const createAliasPlugin = (version) => {
  const threeAlias = version === '160' ? 'three-160' : 'three-129';
  return {
    name: 'three-alias',
    setup(build) {
      build.onResolve({ filter: /^three(\/.*)?$/ }, args => {
        let newPath = args.path;
        if (newPath === 'three') {
          newPath = threeAlias;
        } else if (newPath.startsWith('three/addons/')) {
          newPath = newPath.replace('three/addons/', `${threeAlias}/examples/jsm/`);
        } else if (newPath.startsWith('three/examples/jsm/')) {
          newPath = newPath.replace('three/examples/jsm/', `${threeAlias}/examples/jsm/`);
        }
        return build.resolve(newPath, {
          kind: args.kind,
          resolveDir: args.resolveDir
        });
      });
    }
  };
};

async function build() {
  console.log("Extracting planet_viewer.js...");
  const pvHtmlPath = 'deploy/planets/planet_viewer.html';
  let pvHtml = fs.readFileSync(pvHtmlPath, 'utf8');
  const scriptStart = pvHtml.indexOf('<script type="module">');
  const scriptEnd = pvHtml.indexOf('</script>', scriptStart);
  
  if (scriptStart !== -1) {
    const inlineScript = pvHtml.substring(scriptStart + 22, scriptEnd);
    fs.writeFileSync('deploy/planets/planet_viewer.js', inlineScript.trim());
    
    // Replace inline script with external bundled script
    pvHtml = pvHtml.substring(0, scriptStart) + 
             '<script src="./bundle-planet-viewer.js"></script>' + 
             pvHtml.substring(scriptEnd + 9);
    fs.writeFileSync(pvHtmlPath, pvHtml);
  }

  const bundles = [
    { in: 'deploy/js/main.js', out: 'deploy/js/bundle-main.js', ver: '160' },
    { in: 'deploy/js/compare_init.js', out: 'deploy/js/bundle-compare.js', ver: '160' },
    { in: 'deploy/solarsystem/solarsystem.js', out: 'deploy/solarsystem/bundle-solarsystem.js', ver: '129' },
    { in: 'deploy/trajectory/trajectory.js', out: 'deploy/trajectory/bundle-trajectory.js', ver: '129' },
    { in: 'deploy/planets/planet_viewer.js', out: 'deploy/planets/bundle-planet-viewer.js', ver: '129' }
  ];

  for (const b of bundles) {
    console.log(`Bundling ${b.in} -> ${b.out} (Three.js v${b.ver})`);
    try {
      await esbuild.build({
        entryPoints: [b.in],
        bundle: true,
        minify: true,
        outfile: b.out,
        plugins: [createAliasPlugin(b.ver)],
        format: 'iife'
      });
      console.log(`Successfully bundled ${b.out}`);
    } catch (e) {
      console.error(`Error bundling ${b.in}:`, e);
    }
  }

  console.log("Updating HTML files...");
  
  const htmlUpdates = [
    { path: 'deploy/index.html', find: '<script type="module" src="./js/main.js"></script>', rep: '<script src="./js/bundle-main.js"></script>' },
    { path: 'deploy/compare/index.html', find: '<script type="module" src="../js/compare_init.js"></script>', rep: '<script src="../js/bundle-compare.js"></script>' },
    { path: 'deploy/solarsystem/index.html', find: '<script type="module" src="./solarsystem.js"></script>', rep: '<script src="./bundle-solarsystem.js"></script>' },
    { path: 'deploy/trajectory/index.html', find: '<script type="module" src="./trajectory.js"></script>', rep: '<script src="./bundle-trajectory.js"></script>' }
  ];

  for (const up of htmlUpdates) {
    let content = fs.readFileSync(up.path, 'utf8');
    
    // Remove importmaps and shims
    content = content.replace(/<script async src=".*?es-module-shims.*?"><\/script>\n*/g, '');
    content = content.replace(/<script type="importmap">[\s\S]*?<\/script>\n*/g, '');
    
    // Replace module script with bundle
    content = content.replace(up.find, up.rep);
    
    fs.writeFileSync(up.path, content);
  }
  
  // Update planet_viewer.html importmaps removal (already did the script swap)
  let pvContent = fs.readFileSync(pvHtmlPath, 'utf8');
  pvContent = pvContent.replace(/<script async src=".*?es-module-shims.*?"><\/script>\n*/g, '');
  pvContent = pvContent.replace(/<script type="importmap">[\s\S]*?<\/script>\n*/g, '');
  fs.writeFileSync(pvHtmlPath, pvContent);

  console.log("All done!");
}

build();
