import { prisma } from "../../config/client"
 
const CreateUser = async ( name: string, phone: string, address: string, email: string, password: string ,avatar: string,roleId: string) => {
    const user = await prisma.user.create({
        data : {
            Fullname: name,
            phone,
            address,  
            avatar,
            email,
            password,
            roleId: +roleId
        }
    })
    return user
    
}

const GetAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
}
const DeleteUser = async (id: number) => {
    const user = await prisma.user.delete({
        where: {
            id: id
        }
    });
    return user;
}
const GetUserById = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    });
    return user;
}
export { CreateUser, GetAllUsers, DeleteUser ,GetUserById}