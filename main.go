package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"gopkg.in/olebedev/go-duktape.v2"
	"io/ioutil"
	"os"
	"path/filepath"
	"unsafe"
)

type Command struct {
	Command string `json:"command"`
	Key     string `json:"key"`
	Type    string `json":type"`
}

func loadModule(moduleId string) ([]byte, error) {
	sourceFile := moduleId

	if filepath.Ext(moduleId) != ".js" {
		if _, err := os.Stat(moduleId + ".js"); err == nil {
			sourceFile = moduleId + ".js"
		}
	}

	if src, err := ioutil.ReadFile(sourceFile); err == nil {
		return src, nil
	}

	return nil, errors.New("Could not find module")
}

func main() {
	ctx := duktape.New()
	ctx.PushGlobalObject()

	processIdx := ctx.PushObject()
	envIdx := ctx.PushObject()
	ctx.PushString("development")
	ctx.PutPropString(envIdx, "NODE_ENV")
	ctx.PutPropString(processIdx, "env")
	ctx.PutPropString(-2, "process")

	var getCommandRef unsafe.Pointer
	goIdx := ctx.PushObject()
	ctx.PushGoFunction(func(c *duktape.Context) int {
		command := Command{}
		jsonBlob := c.SafeToString(-1)
		json.Unmarshal([]byte(jsonBlob), &command)

		switch command.Command {
		case "configure":
			c.PushHeapptr(getCommandRef)
			if res := c.Pcall(0); res != 0 {
				fmt.Println(c.SafeToString(-1))
			}
			c.Pop()
		}

		return 0
	})
	ctx.PutPropString(goIdx, "sendCommand")
	ctx.PushGoFunction(func(c *duktape.Context) int {
		getCommandRef = c.GetHeapptr(0)
		c.PutGlobalString("_get_command_ref")

		return 0
	})
	ctx.PutPropString(goIdx, "getCommandFunc")
	ctx.PutPropString(-2, "Go")
	ctx.Pop()

	ctx.PushGlobalGoFunction("loadModule", func(c *duktape.Context) int {
		moduleId := c.SafeToString(-1)

		if src, err := loadModule(moduleId); err == nil {
			ctx.PushString(string(src))
		} else {
			fmt.Println(err)
		}

		return 1
	})
	if err := ctx.PevalFile("bootstrap.js"); err != nil {
		fmt.Println(err)
	}
	if err := ctx.PevalFile("example.js"); err != nil {
		fmt.Println(err)
	}
}
