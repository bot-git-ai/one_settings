.PHONY: install vsix clean

install:
	npm install

vsix: clean
	npm run package

clean:
	rm -rf *.vsix
