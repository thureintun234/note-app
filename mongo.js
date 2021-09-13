const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument node mongo.js <password>')
  process.exit(0)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.0za6w.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean
})

const Note = mongoose.model('Note', noteSchema)


// Note.find({}).then(result => {
//   result.forEach(result => {
//     console.log(result)
//   })
//   mongoose.connection.close()
// })

const note = new Note({
  content: 'callback-function suck',
  date: new Date(),
  important: false
})

note.save()
  .then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })