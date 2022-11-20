import {spawn} from 'child_process';

const spawnOpenAPIGenerator = (args: string[]) => {
  console.log(`Running OpenAPI Generator: openapi-generator-cli ${args.join(' ')}`);
  const openApiGeneratorCLI = spawn('openapi-generator-cli', args);

  // openApiGeneratorCLI.stdout.pipe(process.stdout);
  openApiGeneratorCLI.stderr.pipe(process.stderr);

  openApiGeneratorCLI.on('error', error => console.error(`error: ${error.message}`));
  openApiGeneratorCLI.on('close', code => {
    if (code == 0) {
      console.log('OpenAPI Generator finished');
    } else {
      console.log(`OpenAPI Generator failed with code: ${code}`);
    }
  });
  return openApiGeneratorCLI;
};

spawnOpenAPIGenerator(['generate']);
