.PHONY: install check format format-check vsix clean

install:
	npm install

format:
	npm run format

format-check:
	npm run format:check

check: format-check test

test:
	npm test

vsix: clean
	npm run package

clean:
	rm -rf dist *.vsix
