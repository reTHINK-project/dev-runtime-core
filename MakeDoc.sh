
#!/usr/bin/env bash
echo "Generating documentation..."
JSDocLib/node_modules/.bin/jsdoc -d Documentation src/*
echo "Documentation generated in 'Documentation' directory"
