# MongoDB Aggregation and Indexing Strategies

This guide provides a comprehensive overview of MongoDB's aggregation pipeline, including common stages and operators, along with an explanation of indexing strategies.

---

## MongoDB Aggregation Pipeline

The aggregation pipeline is a powerful framework for data processing in MongoDB. It allows you to transform and analyze documents by passing them through a series of stages. Each stage performs an operation on the input documents and outputs a stream of documents to the next stage.

### Common Aggregation Stages and Operators

#### `$match`

Filters documents based on a specified query.

**Syntax:**

```js
{ $match: { <query> } }
```

**Example:**

```js
db.products.aggregate([
  { $match: { category: "electronics", price: { $gt: 100 } } },
]);
```

_Filters products where the category is "electronics" and the price is greater than 100._

---

#### `$project`

Reshapes each document in the stream, including or excluding fields, or adding new fields.

**Syntax:**

```js
{ $project: { <specification> } }
```

**Example:**

```js
db.products.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      price: 1,
      discount_price: { $multiply: ["$price", 0.9] },
    },
  },
]);
```

_Excludes `_id`, includes `name` and `price`, and adds `discount_price` (90% of price)._

---

#### `$addFields`

Adds new fields to documents. Similar to `$project`, but preserves all existing fields by default.

**Syntax:**

```js
{ $addFields: { <newField>: <expression>, ... } }
```

**Example:**

```js
db.products.aggregate([{ $addFields: { createdAt: new Date() } }]);
```

_Adds a new field `createdAt` with the current date and time._

---

#### `$out`

Writes the aggregated results to a specified collection.

**Syntax:**

```js
{
  $out: "<collectionName>";
}
```

**Example:**

```js
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $out: "completed_orders" },
]);
```

_Filters completed orders and writes them to a new collection named `completed_orders`._

---

#### `$merge`

Writes the aggregated results into a collection. Can insert new documents, merge with existing documents, or replace existing documents.

**Syntax:**

```js
{
  $merge: {
    into: "<collectionName>",
    on: "<field_or_fields>",
    whenMatched: "<action>", // "replace", "keepExisting", "merge", "fail", "pipeline"
    whenNotMatched: "<action>" // "insert", "discard", "fail"
  }
}
```

**Example:**

```js
db.sales.aggregate([
  { $group: { _id: "$product_id", totalQuantitySold: { $sum: "$quantity" } } },
  {
    $merge: {
      into: "product_sales_summary",
      on: "_id",
      whenMatched: "merge",
      whenNotMatched: "insert",
    },
  },
]);
```

_Groups sales by `product_id` and calculates the total quantity sold. Merges results into `product_sales_summary`._

---

#### `$group`

Groups input documents by a specified `_id` expression and applies accumulator expressions to each group.

**Syntax:**

```js
{ $group: { _id: <expression>, <field1>: { <accumulator1> }, ... } }
```

**Example:**

```js
db.orders.aggregate([
  {
    $group: {
      _id: "$customer_id",
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: "$total_price" },
    },
  },
]);
```

_Groups orders by `customer_id` and calculates total orders and revenue for each customer._

---

#### `$sum`

Accumulator operator to calculate the sum of numerical values.

**Syntax (within $group):**

```js
{ $sum: <expression> }
```

_See `$group` example above._

---

#### `$push`

Accumulator operator that returns an array of all values from the input documents for each group.

**Syntax (within $group):**

```js
{ $push: <expression> }
```

**Example:**

```js
db.users.aggregate([
  { $group: { _id: "$city", userNames: { $push: "$name" } } },
]);
```

_Groups users by city and creates an array `userNames` containing the names of all users in that city._

---

#### `$unwind`

Deconstructs an array field from the input documents to output a document for each element.

**Syntax:**

```js
{
  $unwind: "$<field_path>";
}
```

**Example:**

```js
db.books.aggregate([{ $unwind: "$authors" }]);
```

_Creates a separate document for each author in the `authors` array._

---

#### `$sort`

Sorts all input documents and returns them in sorted order to the pipeline.

**Syntax:**

```js
{ $sort: { <field1>: <sort_order>, <field2>: <sort_order>, ... } }
```

_Sort Order: 1 for ascending, -1 for descending._

**Example:**

```js
db.products.aggregate([{ $sort: { price: -1, name: 1 } }]);
```

_Sorts products by price descending, then by name ascending._

---

#### `$limit`

Passes the first n documents unchanged to the pipeline.

**Syntax:**

```js
{ $limit: <number> }
```

**Example:**

```js
db.articles.aggregate([{ $sort: { views: -1 } }, { $limit: 5 }]);
```

_Returns only the top 5 most viewed articles._

---

#### `$lookup`

Performs a left outer join to an unsharded collection in the same database.

**Syntax:**

```js
{
  $lookup: {
    from: "<collection to join>",
    localField: "<field from the input documents>",
    foreignField: "<field from the documents of the 'from' collection>",
    as: "<output array field>"
  }
}
```

**Example:**

```js
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "_id",
      as: "productInfo",
    },
  },
]);
```

_Joins the `orders` collection with the `products` collection based on `product_id`._

---

#### `$bucket`

Categorizes incoming documents into groups, called buckets, based on specified boundaries.

**Syntax:**

```js
{
  $bucket: {
    groupBy: <expression>,
    boundaries: [ <lowerbound1>, <lowerbound2>, ... ],
    default: <literal>,
    output: {
      <outputField1>: { <accumulator1> },
      ...
    }
  }
}
```

**Example:**

```js
db.students.aggregate([
  {
    $bucket: {
      groupBy: "$grade",
      boundaries: [0, 60, 70, 80, 90, 100],
      default: "Other",
      output: {
        count: { $sum: 1 },
        avgGrade: { $avg: "$grade" },
      },
    },
  },
]);
```

_Groups students into grade buckets and calculates the count and average grade within each bucket._

---

#### `$facet`

Allows you to run multiple aggregation pipelines on the same set of input documents within a single aggregation stage.

**Syntax:**

```js
{
  $facet: {
    <outputField1>: [ <pipeline1> ],
    <outputField2>: [ <pipeline2> ],
    ...
  }
}
```

**Example:**

```js
db.movies.aggregate([
  {
    $facet: {
      moviesByYear: [
        { $group: { _id: "$year", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ],
      moviesByGenre: [
        { $unwind: "$genres" },
        { $group: { _id: "$genres", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ],
    },
  },
]);
```

_Runs two parallel pipelines: one to count movies by year, another by genre._

---

## MongoDB Indexing Strategies

Indexes are special data structures that store a small portion of the data in an easy-to-traverse form. They improve the efficiency of read operations by allowing MongoDB to quickly locate documents without scanning every document in a collection.

### COLLSCAN vs. IXSCAN

- **COLLSCAN (Collection Scan):** MongoDB scans every document in a collection to fulfill a query. Inefficient for large collections.
- **IXSCAN (Index Scan):** MongoDB uses an index to locate relevant documents. Much more efficient.

To check if a query is using an index, use `explain()`:

```js
db.mycollection.find({ field: "value" }).explain("executionStats");
```

Look for `winningPlan.stage` to be `IXSCAN` or `COLLSCAN`.

---

### Types of Indexes

#### Single Field Index

The simplest type of index, created on a single field.

**Example:**

```js
db.users.createIndex({ email: 1 });
```

_Creates an ascending index on the `email` field._

---

#### Compound Index

Includes multiple fields. The order of fields matters.

**Example:**

```js
db.products.createIndex({ category: 1, price: -1 });
```

_Creates a compound index on `category` (ascending) and `price` (descending)._

**Prefix Rule:** A compound index can support queries that use a prefix of the indexed fields.

---

#### Text Index

Supports text search queries on string content.

**Example:**

```js
db.articles.createIndex({ content: "text" });
```

_Creates a text index on the `content` field._

You can also create a text index on multiple fields:

```js
db.articles.createIndex({ title: "text", description: "text" });
```

---

### Best Practices for Indexing

- **Index frequently queried fields:** Focus on fields used in `find()` queries, `$match` stages, and `sort()` operations.
- **Index fields with high cardinality:** Fields with many unique values are good candidates.
- **Consider compound indexes for multi-field queries:** Design compound indexes to support common query patterns and sort orders.
- **Use `explain()` to analyze query performance:** Regularly check query plans to ensure indexes are being utilized.
- **Avoid over-indexing:** Too many indexes can increase write overhead and consume more disk space.
- **Index fields used in `$lookup` and `$unwind`:** These stages can benefit from appropriate indexes.
- **Understand index overhead:** Indexes need to be updated with every write operation (insert, update, delete), which adds overhead.
