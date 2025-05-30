// 7. Remove the skill with the name "Kotlin" from the skills array.

db.test.updateMany({ "skills.name": "KOTLIN" },
    {
        $pull: {
            skills: {name: "KOTLIN"}
        }
    })


