class UserDto {
  constructor(user) {
    this.id = user._id;
    this.email = user.email;
    this.first_name = user.first_name; 
    this.last_name = user.last_name;   
    this.name = user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.name;
    this.role = user.role;
    this.age = user.age; // Agregar edad
    this.cart = user.cart || null;
    this.createdAt = user.createdAt;
  }
}

module.exports = UserDto;