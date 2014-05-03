function getQuestScript() {
var scriptSavedJSON = JSON.parse(
"{\n\t\"ver\": 1,\n\t\"name\": \"story\",\n\t\"stages\": [\n\t\t{\n\t\t\t\"ver\": 1,\n\t\t\t\"stageNodeId\": 8,\n\t\t\t\"nodes\": [\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 8,\n\t\t\t\t\t\"type\": 9,\n\t\t\t\t\t\"label\": \"Stage1\",\n\t\t\t\t\t\"continue\": false,\n\t\t\t\t\t\"inCondIds\": [],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t0\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"name\": \"Stage1\",\n\t\t\t\t\t\t\"objs\": [\n\t\t\t\t\t\t\t\"Player\",\n\t\t\t\t\t\t\t\"Older\"\n\t\t\t\t\t\t],\n\t\t\t\t\t\t\"objPool\": []\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 9,\n\t\t\t\t\t\"type\": 8,\n\t\t\t\t\t\"label\": \"\",\n\t\t\t\t\t\"continue\": false,\n\t\t\t\t\t\"inCondIds\": [\n\t\t\t\t\t\t0,\n\t\t\t\t\t\t6,\n\t\t\t\t\t\t29\n\t\t\t\t\t],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t2\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"objs\": [\n\t\t\t\t\t\t\t\"Player\",\n\t\t\t\t\t\t\t\"Older\"\n\t\t\t\t\t\t]\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 12,\n\t\t\t\t\t\"type\": 3,\n\t\t\t\t\t\"label\": \"Older: Hello!\",\n\t\t\t\t\t\"continue\": false,\n\t\t\t\t\t\"inCondIds\": [\n\t\t\t\t\t\t2\n\t\t\t\t\t],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t4,\n\t\t\t\t\t\t5\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"id\": \"Older\",\n\t\t\t\t\t\t\"text\": \"Hello, dude!\\nHow are you?\",\n\t\t\t\t\t\t\"phraseType\": \"SPEAK\",\n\t\t\t\t\t\t\"ans1\": \"Baaaad :(\",\n\t\t\t\t\t\t\"ans2\": \"Not bad, thanks\",\n\t\t\t\t\t\t\"ans3\": \"Gooooood\",\n\t\t\t\t\t\t\"ans4\": \"Hoooooray\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 13,\n\t\t\t\t\t\"type\": 1,\n\t\t\t\t\t\"label\": \"bad\",\n\t\t\t\t\t\"continue\": false,\n\t\t\t\t\t\"inCondIds\": [\n\t\t\t\t\t\t4\n\t\t\t\t\t],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t6\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"id\": \"Older\",\n\t\t\t\t\t\t\"text\": \"I think you need to take a rest from work.\",\n\t\t\t\t\t\t\"phraseType\": \"SPEAK\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 14,\n\t\t\t\t\t\"type\": 1,\n\t\t\t\t\t\"label\": \"ok\",\n\t\t\t\t\t\"continue\": true,\n\t\t\t\t\t\"inCondIds\": [\n\t\t\t\t\t\t5\n\t\t\t\t\t],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t28\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"id\": \"Older\",\n\t\t\t\t\t\t\"text\": \"That's very good dude! (:3\",\n\t\t\t\t\t\t\"phraseType\": \"SPEAK\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 28,\n\t\t\t\t\t\"type\": 10,\n\t\t\t\t\t\"label\": \"Call foo\",\n\t\t\t\t\t\"continue\": false,\n\t\t\t\t\t\"inCondIds\": [\n\t\t\t\t\t\t28\n\t\t\t\t\t],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t29\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"name\": \"foo\"\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t],\n\t\t\t\"conds\": [\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 0,\n\t\t\t\t\t\"type\": 1,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 2,\n\t\t\t\t\t\"type\": 2,\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"id\": \"Older\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 4,\n\t\t\t\t\t\"type\": 3,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 5,\n\t\t\t\t\t\"type\": 7,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 6,\n\t\t\t\t\t\"type\": 1,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 28,\n\t\t\t\t\t\"type\": 8,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 29,\n\t\t\t\t\t\"type\": 1,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t}\n\t\t\t]\n\t\t},\n\t\t{\n\t\t\t\"ver\": 1,\n\t\t\t\"stageNodeId\": 10,\n\t\t\t\"nodes\": [\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 10,\n\t\t\t\t\t\"type\": 9,\n\t\t\t\t\t\"label\": \"Stage2\",\n\t\t\t\t\t\"continue\": false,\n\t\t\t\t\t\"inCondIds\": [],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t1\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"name\": \"Stage2\",\n\t\t\t\t\t\t\"objs\": [\n\t\t\t\t\t\t\t\"Player\",\n\t\t\t\t\t\t\t\"FatNerd\"\n\t\t\t\t\t\t],\n\t\t\t\t\t\t\"objPool\": []\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 11,\n\t\t\t\t\t\"type\": 8,\n\t\t\t\t\t\"label\": \"\",\n\t\t\t\t\t\"continue\": false,\n\t\t\t\t\t\"inCondIds\": [\n\t\t\t\t\t\t1,\n\t\t\t\t\t\t16\n\t\t\t\t\t],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t9\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"objs\": [\n\t\t\t\t\t\t\t\"Player\",\n\t\t\t\t\t\t\t\"FatNerd\"\n\t\t\t\t\t\t]\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 16,\n\t\t\t\t\t\"type\": 3,\n\t\t\t\t\t\"label\": \"Wanna play?\",\n\t\t\t\t\t\"continue\": false,\n\t\t\t\t\t\"inCondIds\": [\n\t\t\t\t\t\t9\n\t\t\t\t\t],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t10,\n\t\t\t\t\t\t11,\n\t\t\t\t\t\t12\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"id\": \"FatNerd\",\n\t\t\t\t\t\t\"text\": \"Hello, man. Wanna play World of Tanks?\",\n\t\t\t\t\t\t\"phraseType\": \"SPEAK\",\n\t\t\t\t\t\t\"ans1\": \"Yes\",\n\t\t\t\t\t\t\"ans2\": \"No\",\n\t\t\t\t\t\t\"ans3\": \"Fucking Nerds...\",\n\t\t\t\t\t\t\"ans4\": \"\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 17,\n\t\t\t\t\t\"type\": 1,\n\t\t\t\t\t\"label\": \"Yes\",\n\t\t\t\t\t\"continue\": true,\n\t\t\t\t\t\"inCondIds\": [\n\t\t\t\t\t\t10\n\t\t\t\t\t],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t20\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"id\": \"Player\",\n\t\t\t\t\t\t\"text\": \"Yes!\",\n\t\t\t\t\t\t\"phraseType\": \"SPEAK\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 18,\n\t\t\t\t\t\"type\": 1,\n\t\t\t\t\t\"label\": \"No\",\n\t\t\t\t\t\"continue\": false,\n\t\t\t\t\t\"inCondIds\": [\n\t\t\t\t\t\t11\n\t\t\t\t\t],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t26\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"id\": \"Player\",\n\t\t\t\t\t\t\"text\": \"No, thanks.\",\n\t\t\t\t\t\t\"phraseType\": \"SPEAK\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 19,\n\t\t\t\t\t\"type\": 1,\n\t\t\t\t\t\"label\": \"Fuckn nerds\",\n\t\t\t\t\t\"continue\": true,\n\t\t\t\t\t\"inCondIds\": [\n\t\t\t\t\t\t12\n\t\t\t\t\t],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t14\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"id\": \"Player\",\n\t\t\t\t\t\t\"text\": \"Fucking nerds! I've got tired of you!!!\",\n\t\t\t\t\t\t\"phraseType\": \"SPEAK\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 21,\n\t\t\t\t\t\"type\": 1,\n\t\t\t\t\t\"label\": \"Crying\",\n\t\t\t\t\t\"continue\": false,\n\t\t\t\t\t\"inCondIds\": [\n\t\t\t\t\t\t15\n\t\t\t\t\t],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t17\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"id\": \"FatNerd\",\n\t\t\t\t\t\t\"text\": \"Crying\",\n\t\t\t\t\t\t\"phraseType\": \"THINK\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 22,\n\t\t\t\t\t\"type\": 6,\n\t\t\t\t\t\"label\": \"3 sec\",\n\t\t\t\t\t\"continue\": true,\n\t\t\t\t\t\"inCondIds\": [\n\t\t\t\t\t\t14\n\t\t\t\t\t],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t15\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"secs\": 2\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 23,\n\t\t\t\t\t\"type\": -1,\n\t\t\t\t\t\"label\": \"Connection node\",\n\t\t\t\t\t\"continue\": false,\n\t\t\t\t\t\"inCondIds\": [\n\t\t\t\t\t\t17,\n\t\t\t\t\t\t19,\n\t\t\t\t\t\t26\n\t\t\t\t\t],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t16\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 24,\n\t\t\t\t\t\"type\": 1,\n\t\t\t\t\t\"label\": \"Let's play!\",\n\t\t\t\t\t\"continue\": false,\n\t\t\t\t\t\"inCondIds\": [\n\t\t\t\t\t\t21\n\t\t\t\t\t],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t19\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"id\": \"FatNerd\",\n\t\t\t\t\t\t\"text\": \"Cool! Let's play!\",\n\t\t\t\t\t\t\"phraseType\": \"SPEAK\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 25,\n\t\t\t\t\t\"type\": 6,\n\t\t\t\t\t\"label\": \"3 sec\",\n\t\t\t\t\t\"continue\": true,\n\t\t\t\t\t\"inCondIds\": [\n\t\t\t\t\t\t20\n\t\t\t\t\t],\n\t\t\t\t\t\"outCondIds\": [\n\t\t\t\t\t\t21\n\t\t\t\t\t],\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"secs\": 3\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t],\n\t\t\t\"conds\": [\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 1,\n\t\t\t\t\t\"type\": 1,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 9,\n\t\t\t\t\t\"type\": 2,\n\t\t\t\t\t\"props\": {\n\t\t\t\t\t\t\"id\": \"FatNerd\"\n\t\t\t\t\t}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 10,\n\t\t\t\t\t\"type\": 3,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 11,\n\t\t\t\t\t\"type\": 4,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 12,\n\t\t\t\t\t\"type\": 5,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 14,\n\t\t\t\t\t\"type\": 8,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 15,\n\t\t\t\t\t\"type\": 8,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 16,\n\t\t\t\t\t\"type\": 1,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 17,\n\t\t\t\t\t\"type\": 1,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 19,\n\t\t\t\t\t\"type\": 1,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 20,\n\t\t\t\t\t\"type\": 8,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 21,\n\t\t\t\t\t\"type\": 8,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t\"ver\": 1,\n\t\t\t\t\t\"id\": 26,\n\t\t\t\t\t\"type\": 1,\n\t\t\t\t\t\"props\": {}\n\t\t\t\t}\n\t\t\t]\n\t\t}\n\t]\n}"
);
return SEScript.load(scriptSavedJSON);
}