// 5. Add a new skill to the skills array for the document with the email
// "amccurry3@cnet.com". The skill is
//   {" name"  : "Python", "level": "Beginner","isLearning": true}
// Note: At first, you will have to insert the given email then add the skill mentioned above

db.test.updateOne({ email: "amccurry3@cnet.com" },
    {
        $addToSet:  {
            skills:   {" name"  : "Python", "level": "Beginner","isLearning": true}
        }
    })