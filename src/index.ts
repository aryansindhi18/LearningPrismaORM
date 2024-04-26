import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function insertUser(username: string, 
    password: string, 
    firstName: string, 
    lastName: string,
    email: string) {
    const res = await prisma.user.create({
      data: {
          username,
          password,
          firstName,
          lastName,
          email
      }
    })
    console.log(res);
  }
  
//   insertUser("admin1", "123456", "aryan", "sindhi",`arfc18@gmail.com`);


async function createTodo(user_id: number, title: string, description: string,done: boolean) {
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        user_id,
        done
      },
    });
    console.log(todo);
  
  }
  
//   createTodo(1, "go to gym", "go to gym and do 10 pushups",false);

async function getTodos(userId: number, ) {
    const todos = await prisma.todo.findMany({
        where: {
        user_id: userId,
        },
    });
    console.log(todos);
}

// getTodos(1);

async function getTodosAndUserDetails(userId: number, ) {
    const todos = await prisma.todo.findMany({
        where: {
            user_id: userId,
        },
        select: {
            user: true,
            title: true,
            description: true
        }
    });
    console.log(todos);
}

getTodosAndUserDetails(1);
