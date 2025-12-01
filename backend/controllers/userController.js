import prisma from "../db.js";

// add user
export const createUser = async (req,res) => {
    try {
        const {name,email,password} = req.body;
        const user = await prisma.user.create({
            data:{name,email,password},
        });
        res.json(user);
    }catch(err) {
        res.status(500).json({error:err.message});
    }
};

// get all users
export const getUsers = async (req,res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy:{id:"asc"},
        });
        res.json(users);
    }catch(err) {
        res.status(500).json({error:err.message});
    }
};

// get user by id
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//update user
export const updateUser = async(req,res) => {
    try {
        const {name, email, password} = req.body;
        const {id} = req.params;
        const updateUser = await prisma.user.update ({
            where: {id:Number(id)},
            data:{name,email,password},
        });
        res.json(updateUser);
    }catch(err) {
        res.status(500).json({error:err.message});
    }
}

//delete user
export const deleteUser = async(req,res) => {
    try {
        const {id}=req.params;
        await prisma.user.delete({
            where:{id:Number(id)},
        });
        res.json({message:"Deleted"})
    }catch(err) {
        res.status(500).json({error:err.message});
    }
};

// admin login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Check password (in a real app, you would hash passwords)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Return user info (excluding password)
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};