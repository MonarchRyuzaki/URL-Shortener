local file = io.open("shortUrls.txt", "r")
local keys = {}

if file then
    for line in file:lines() do
        -- Trim whitespace
        local clean_line = string.gsub(line, "^%s*(.-)%s*$", "%1")
        -- Extract last part after final '/'
        local key = clean_line:match("^.+/(.+)$")
        if key then
            table.insert(keys, key)
        end
    end
    file:close()
else
    error("Could not open shortUrls.txt")
end

local counter = 1

request = function()
    local key = keys[counter]
    counter = counter + 1
    if counter > #keys then counter = 1 end
    return wrk.format("GET", "/api/v1/" .. key)
end
