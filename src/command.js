import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { createNote, getNotes, findNotes, removeNote, removeAllNotes } from './notes.js'

yargs(hideBin(process.argv))
  .command('new <note>', 'Create a new note', yargs => {
    return yargs.positional('note', {
      type: 'string',
      description: 'The note to create',
    })
  }, async (argv) => {
    console.log(`Creating a new note: ${argv.note}`)
    const tags = argv.tags ? argv.tags.split(',') : [];
    await createNote(argv.note, tags);
    console.log('Note created successfully');
  })
  .option('tags', {
    alias: 't',
    type: 'string',
    description: 'Add tags to your note',
  })
  .command('all', 'get all notes', () => {}, async (argv) => {
    const notes = await getNotes();
    console.log(": All Notes :");
    console.log(notes);
  })
  .command('find <filter>', 'get matching notes', yargs => {
    return yargs.positional('filter', {
      describe: 'The search term to filter notes by, will be applied to note.content',
      type: 'string'
    })
  }, async (argv) => {
    const notes = await findNotes(argv.filter);
    console.log(`: Notes matching "${argv.filter}" :`);
    console.log(notes);
  })
  .command('remove <id>', 'remove a note by id', yargs => {
    return yargs.positional('id', {
      type: 'number',
      description: 'The id of the note you want to remove'
    })
  }, async (argv) => {
    await removeNote(argv.id);
    console.log(`Note with id ${argv.id} removed successfully`);
  })
  .command('web [port]', 'launch website to see notes', yargs => {
    return yargs
      .positional('port', {
        describe: 'port to bind on',
        default: 5000,
        type: 'number'
      })
  }, async (argv) => {
    
  })
  .command('clean', 'remove all notes', () => {}, async (argv) => {
    await removeAllNotes();
    console.log('All notes removed successfully');
  })
  .demandCommand(1)
  .parse()
