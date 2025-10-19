// Upload image for a post
router.post('/:id/image', upload.single('image'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (req.file) {
      post.image = req.file.filename;
      const updatedPost = await post.save();
      res.json(updatedPost);
    } else {
      res.status(400).json({ message: 'No image file provided' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
