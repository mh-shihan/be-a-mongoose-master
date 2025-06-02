db.test.aggregate([
    // stage-1
    {
        $group: {
            _id: null,
            totalSalary: { $sum: "$salary" },
            maxSalary: { $max: "$salary" },
            minSalary: { $min: "$salary" },

        }

    },
    // stage-2
    {
        $project: {
            maximum_salary: "$maxSalary",
            minimum_salary: "$minSalary",
            comparison_between_min_max_salary: { $subtract: ["$maxSalary", "$minSalary"] }
        }
    }

])
