import Image from "next/image";
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient()

export default async function Home() {
  const todos = await prisma.todo.findMany();

    async function addTodo(formData:FormData){
        "use server"
        const message = formData.get("createTodo")
        if(message){
          await prisma.todo.create({
            data:{
                content: message!.toString(),
            },
        });
        }
        revalidatePath("/")
    }
    async function delTodo(formData: FormData) {
        "use server"
        const id = formData.get("todoId")
        if(id){
          await prisma.todo.delete({
            where:{
                id: parseInt(id),
            },
        });
        }
        revalidatePath("/")
        
    }
  return (
    <main className="flex max-w-screen-lg w-full px-4 py-4 flex-col m-auto space-x-5 gap-4 bg-gradient-to-br from-black">
       <h1 className="font-bold text-3xl">Pasty.  |  To do list</h1>
            <form action={addTodo} className="flex w-full justify-between gap-4 ">
                <input name="createTodo" className="w-full rounded-lg text-black px-2" type="text"/>
                <button type="submit" className="text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Přidat</button>
            </form>
            {
                todos.map((todo: any)=>(
                    <div key={todo.id} className="flex flex-row justify-between center bg-white text-black p-4 rounded-md ">
                        <p>{todo.content}</p>
                        <form action={delTodo}>
                            <button type="submit" name="todoId" value={todo.id} className="cursor-pointer:hover"><img className="h-5" src="/trash.png"/></button>
                        </form>
                    </div>
                )
                )}
    </main>
  );
}
