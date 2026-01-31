import { Request, Response } from 'express';
import { CreateUser, DeleteUser, GetAllUsers, GetUserById } from '../../service/user/user.services';
const CreateUSerApi = async (req: Request, res: Response) => {
        const { name, phone, address, email, password ,avatar,roleId} = req.body;
        try {
            const user = await CreateUser(name, phone, address, email, password ,avatar,roleId);
            res.status(201).json({ message: 'User created successfully', user });
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error });
        }

}

const GetAllUsersApi = async (req: Request, res: Response) => {
    try {
        const users = await GetAllUsers();
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }   
}
const DeleteUserApi = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await DeleteUser(+id);
        res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }       
}
const GetUserByIdApi = async (req: Request, res: Response) => {
    const { id } = req.params;
        try{
            const user = await GetUserById(+id);
            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user', error });
        }   
    }


export { CreateUSerApi,GetAllUsersApi,DeleteUserApi,GetUserByIdApi }