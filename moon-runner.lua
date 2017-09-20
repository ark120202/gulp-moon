local parse = require "moonscript.parse"
local compile = require "moonscript.compile"

local code = "{CODE}"

local tree, err = parse.string(code)
if not tree then
  io.stderr:write(err)
else
  local lua, err, pos = compile.tree(tree)
  if not lua then
    io.stderr:write(compile.format_error(err, pos, code))
  else
    io.write(lua)
  end
end
