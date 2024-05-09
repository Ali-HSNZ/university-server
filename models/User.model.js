module.exports = (sequelize, DataType) => {
    const User = sequelize.define('User', {
        first_name: {
            type: DataType.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    })
    return User
}
