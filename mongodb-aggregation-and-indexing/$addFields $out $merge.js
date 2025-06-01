db.test.aggregate([
    // stage-1
    { $match: { gender: "Male" } },
    // stage-2
    {
        $addFields: { course: "Level-2", eduTech: "Programming-Hero" }
    },
    // stage-3
    { $project: { course: 1, eduTech:1 } },
    // stage-4
    // {$merge:  "test"},
    // stage-5
  {  $out: "output-collection"}
])