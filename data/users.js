import bcrypt from 'bcryptjs'
const Users = [
    {
        name : 'Babalola Abdulazeez',
        email : 'moshaaallah000@gmail.com',
        password : bcrypt.hashSync('developer',12),
        isAdmin : true,
        no : 9013562269,
        isVerified:true
    },
    {
        name : 'Babalola Ibrahim',
        email : 'hidressupibadan@gmail.com',
        password : bcrypt.hashSync('client',12),
        isAdmin : true,
        no : 8165732866,
        isVerified:true
    },


]
export default Users