ReactGo
===
Simple example of running React in Go. Not in any way fully featured, more a proof of concept than anything.

NOTES
===
* Building with duktape on windows causes multiple definition error. Use the following to build until they [fix golang linker](https://github.com/golang/go/issues/9510).
    go build -ldflags "-extldflags=-Wl,--allow-multiple-definition"
