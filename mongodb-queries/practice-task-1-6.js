// 6. Add a new language "Spanish" to the list of languages spoken by the person.

db.test.updateMany({ languages: { $all:  ["Spanish"] } },
    {
        $addToSet: {
            languages: "Bangla"
        }
    })


