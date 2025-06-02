// db.test.aggregate([
//     // stage-1
//     {
//         $unwind: "$friends"
//     },
//     // stage-2
//     {
//         $group: { _id: "$friends", count : {$sum: 1}}
//     }
//     ])


db.test.aggregate([
    { $unwind: "$interests" },
    {
        $group: {
            _id: "$age", 
            count: { $sum: 1 },
            interestesPerAge: {$push: "$interests"}
        }
    },
    {
        $sort:
            { _id: 1 }

    }
])