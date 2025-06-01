-- Per-thread key store
local keys = {}
local thread_id = 0  -- Will be set uniquely per thread

-- Utility to generate a random string key
function random_key()
  local charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  local length = 8
  local res = ""
  for i = 1, length do
    local rand = math.random(1, #charset)
    res = res .. charset:sub(rand, rand)
  end
  return res
end

-- Called once per thread to set up per-thread state
function setup(thread)
  thread_id = thread:get("id")  -- wrk assigns a unique id to each thread
end

function init(args)
  math.randomseed(os.time() + thread_id)
  keys = {}
end

function request()
  -- 50% chance: new key or existing key
  local use_new_key = math.random() < 0.5
  local key

  if use_new_key or #keys == 0 then
    key = random_key()
    table.insert(keys, key)
  else
    key = keys[math.random(1, #keys)]
  end

  local url_path = string.format("example.com/connectionNo%d/%s", thread_id, key)
  local body = string.format('{"originalUrl":"%s"}', url_path)

  wrk.headers["Content-Type"] = "application/json"
  return wrk.format("POST", "/api/v1/shorten", nil, body)
end
