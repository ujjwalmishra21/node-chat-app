const expect = require('expect')
const {Users} = require('./users')


describe('Users',()=>{
  var users;

  beforeEach(()=>{
    users = new Users();
    users.users = [{
      id:'1',
      name:'Utpal',
      room:'Bro'
    },{
      id:'2',
      name:'Shalabh',
      room:'Bro'
    },{
      id:'3',
      name:'Vareesh',
      room:'College'
    }]
  });

  it('should add new user',()=>{
    var users = new Users();
    var user = {
      id:'123',
      name:'Ujjwal',
      room:'Room1'

    }

    var resUser = users.addUser(user.id, user.name, user.room)

    expect(users.users).toEqual([user])
  });

  it('should return names for Bro',()=>{
    var userList = users.getUserList('Bro');
    expect(userList).toEqual(['Utpal', 'Shalabh'])
  })

  it('should return names for College',()=>{
    var userList = users.getUserList('College');
    expect(userList).toEqual(['Vareesh'])
  })

  it('should find the user',()=>{
    var userId = '2'
    var user = users.getUser(userId)

    expect(user.id).toBe(userId)
  })

  it('should not find the user',()=>{
    var userId = '99'
    var user = users.getUser(userId)

    expect(user).toBeFalsy()
  })

  
  it('should remove a user',()=>{
    var userId = '1'
    var user = users.removeUser(userId)

    expect(user.id).toBe(userId)
    expect(users.users.length).toBe(2)
  })
  it('should not remove a user',()=>{
    var userId = '99'
    var user = users.removeUser(userId)

    expect(user).toBeFalsy()
    expect(users.users.length).toBe(3)
  })


})