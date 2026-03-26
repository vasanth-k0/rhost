import sys
import json

script = json.loads(sys.argv[1])['script']
print(exec(script))