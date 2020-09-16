# E\*trade does 2FA badly

You should want to use two-factor authentication. If you have anything to lose, even as low-value as comfort or habits, you should enable two-factor authentication. Almost everywhere supports 2FA these days.

Some are good ways, like supporting U2F so a yubikey-like device can auth to lots of web sites. Or supporting general Time-based One-Time-Passwords.

Some are bad, like SMS messages or asking you to carry/store/keep a single-purpose hardware device that's only good for that one site.

E\*trade is one of the bad ones. Woe to you if your employer uses them.

## sin #1: E\*trade requires you make room in your life for special hardware or special software

This is part of a class of sins, where E\*trade acts like it's the most important web site in your life.

According to E\*trade, to make your account secure, you can't use your normal 2FA tools. You must use *their* tools.

Either you need to own a hardware number generator that is only good for the E\*trade web site, or you need to install a different 2FA app made my Symantec. Yes, the Symantec that has a terrible reputation for awful software and bad security policies and for leaked secrets and for losing control of their CA master.

E\*trade isn't interested in integrating into your secure life.

## sin #2: E\*trade sabotages your secure password manager

This is another in the class of sins where E\*trade acts like it's the most important web site in your life.

To enter your 2FA token, you don't enter the token in a normal form field. Instead, inside the password field, you're supposed to append the digits that come out of your code generator. “hunter2” → “hunter2925305”, except invisible.

So, if you have a password manager, as everyone should, then you're supposed to take the •••••••••••••••••••• and make it look like ••••••••••••••••••••••••••, and, vitally, when your browser or password manager notices you're “changing your password”, click *No, don't save.*

E\*trade shouldn't make it hard to use good passwords. Their dumb 2FA shouldn't cripple your security.


## sin #3: E\*trade sabotages your long password

This complaint is a bit of a stretch, but there is a real bug here that will bite some of us.

E\*trade has restrictions on passwords. They can't be too short, or be too simple. This is good! They also don't have stupid restrictions on the kind of characters you must not use. *Hooray, E\*trade! You did this right!*

E\*trade said, when you set your password, that it can be 32 characters long. Longer is better. Your password manager will happily save and restore 32. 8uM7cf@kGAxx4d^5zW@n%RRyYesvWKGM would be an excellent password. Generate! Save! Done.

If you did that, you are about to be locked out.  Remember the way you have to send 2FA codes to E\*trade? You have to append it to the password field?

E\*trade's web site doesn't take anything after the 32nd character. Now that you turn on 2FA, and because E\*trade pretends the 2FA is part of the password, your *valid* password response is now longer than 32 characters. It will be impossible to reply correctly. E\*trade made it possible to set credentials that they make it impossible to test against.

To use 2FA at E\*trade, you have to first weaken your password to 26 characters or fewer, so that after you append the 6 code numbers, it will come in under the 32 limit.


# What can we do?

You can use a bank or securities institution that does 2FA in a friendly way.

If you are technically savvy, you can subvert some of the obstacles E\*trade needlessly put in your way.

## Shorten your password to 26 characters

Grr. It's necessary, or else you're going to get locked out as soon as you turn 2FA on. 

## Make your web browser fix E\*trade's web site

Browser extensions for
[Firefox](https://addons.mozilla.org/en-US/firefox/addon/etrade-2fa-sensible-log-in/) and Chrome fix the E\*trade log-in form to split the 2FA into a visible field that doesn't interfere with your password manager. It's super simple and adds the 2FA code to the password code as part of submitting the form. (Some password managers might still ask to save. Bug reports are welcome.)

## Use Authy or Google Authenticator with E\*trade

You already use Authy or G-A to hold dozens of 2FA creds? Cool. It can do E\*trade 2FA too, but there's a tiresome protocol dance first. The [python-vipaccess project at Github](https://github.com/dlenski/python-vipaccess) will ask for an untethered credential, and then you can store it in your 2FA app, then register that credential and the first code with E\*trade.

If you have access to a Ubuntu/Debian Linux box, first install "qrcode" and "oathtool" packages. Use docker to get Ubuntu temporarily if you're at all unsure. `docker run -ai ubuntu /bin/bash`

If you have access to a OSX box, first install "qrcode" and "oath-toolkit" and "python3" brew packages.

```bash
cd `mktemp -d`
echo "It's okay to remove `pwd` when you're finished."
python3 -m venv v
. v/bin/activate

pip install https://github.com/dlenski/python-vipaccess/archive/master.zip
vipaccess provision -t VSMT -o vipdotfile
qrencode -t UTF8 `vipaccess uri -f vipdotfile |tail -n 1`
```

It will emit “You will need the ID to register this credential: .....” along with a barcode.

In your 2FA code program, scan the QR code to import it.

At E\*trade, you'll need the ID listed above with “you will need the ID” and a code coming out of your Auth app.
