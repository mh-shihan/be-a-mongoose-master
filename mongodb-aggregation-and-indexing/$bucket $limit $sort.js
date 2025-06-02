db.test.aggregate([
    // stage - 1
    {
        $bucket: {
            groupBy: "$age",
            boundaries: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            default: "Remaining age",
            output: {
               count: { $sum: 1 },
               fullName: {$push: {$concat: ["$name.firstName", " ", "$name.lastName" ]}}
                
            }
        }
    },
    //  stage - 2
    {
        $limit: 5
    }
])