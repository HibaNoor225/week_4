function validateTask(req, res, next) {
  const { title, completed } = req.body;

  console.log("Incoming JSON Data:", req.body); 

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Title must be a non-empty string" });
  }

  if (typeof completed !== "boolean")
     {
    return res.status(400).json({ error: "Completed must be true or false" });
  }
 next();
  
}
module.exports=validateTask;