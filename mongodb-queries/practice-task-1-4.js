// 4. Find documents where the person has skills in both "JavaScript" and "Java."

db.test.find({"skills.name": {$all: ["JAVA", "JAVASCRIPT"]}}).projection({"skills.name": 1})