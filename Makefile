all: chrome.zip firefox.zip

%.zip: %/manifest.json icons/ icons/six-digits.png
	d=$$(mktemp -d); cp -r $^ $$d && cd $$d && zip ${PWD}/$@ -r .
	unzip -l $@

clean:
	rm -f chrome.zip firefox.zip
