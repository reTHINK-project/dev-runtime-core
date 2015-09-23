
#!/usr/bin/env bash
echo "Generating documentation..."
JSDocLib/node_modules/.bin/jsdoc -d Docs src/*
echo "Documentation generated in 'Docs' directory"
