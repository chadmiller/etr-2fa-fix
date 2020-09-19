all: etrade-2fa-fix.zip

%.zip: manifest.json fix-form.js icons/
	d=$$(mktemp -d); cp -r $^ $$d && cd $$d && zip -q ${PWD}/$@ -r . -x \*.xcf && rm -r $$d
	unzip -l $@

clean:
	rm -f etrade-2fa-fix.zip
