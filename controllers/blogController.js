// ติดต่อฐานข้อมูล

const slugify = require("slugify");
const Blogs = require("../models/blogs");
const { v4: uuidv4 } = require("uuid");

// บันทึกข้อมูล
exports.create = (req, res) => {
  const { title, content, author } = req.body;
  let slug = slugify(title);

  if (!slug) slug = uuidv4();
  switch (true) {
    case !title:
      return res.status(400).json({ error: "กรุณาป้อนชื่อบทความ" });
      break;
    case !content:
      return res.status(400).json({ error: "กรุณาป้อนเนี้อหาบทความ" });
      break;
  }

  Blogs.create({ title, content, author, slug })
    .then((blog) => {
      res.json(blog);
    })
    .catch((err) => {
      res.status(400).json({ error: "มีชื่อบทความซ้ำกัน" });
    });
};

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.find({}).exec();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลบทความ" });
  }
};

//ดึงบทความที่สนใจ
exports.singleBlog = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blogs.findOne({ slug }).exec();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลบทความ" });
  }
};

//ลบข้อมูล
exports.remove = async (req, res) => {
  try {
    const { slug } = req.params;
    await Blogs.findOneAndRemove({ slug }).exec();
    res.json({ message: "ลบบทความเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบบทความ" });
  }
};

//อัพเดต
exports.update = async (req, res) => {
  try {
    const { slug } = req.params;

    const { title, content, author } = req.body;

    const blog = await Blogs.findOneAndUpdate(
      { slug },
      { title, content, author },
      { new: true }
    ).exec();
    res.json(blog);
  } catch (err) {
    res.status(500).json(err);
  }
};
