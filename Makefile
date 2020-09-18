all: chrome.zip firefox.zip

%.zip: %-manifest.json fix-form.js icons/
	d=$$(mktemp -d); cp -r $^ $$d && cd $$d && mv $*-manifest.json manifest.json && zip -q ${PWD}/$@ -r . -x \*.xcf && rm -r $$d
	unzip -l $@

clean:
	rm -f chrome.zip firefox.zip
