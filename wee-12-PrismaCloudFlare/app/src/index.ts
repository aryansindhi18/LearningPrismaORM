/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
// import { PrismaClient } from '@prisma/client'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMTI0NzAwOWQtZDlkMi00ODNjLWFlZDEtMzY3ZjkzYzM3NTQ1IiwidGVuYW50X2lkIjoiZWVlZmJjOWE1NWUyNTk4NjJiYzEyY2EwZDhkNGMxOGMxNzUzNDViNGYzYzI1ZWZmZmMzYzY3MTVmMzMwZDM4ZiIsImludGVybmFsX3NlY3JldCI6ImNhNjM3YWVlLTllZTktNDEwOC1hMTNiLTk0ZTJlZjZhNDc2YyJ9.W8yEqSs7R_hTJLuTii9ScgoVngPolNHkk2vVxY9zKPU"

export interface Env{
	DATABASE_URL: string
}

export default {
	async fetch(request: Request, 
		env: Env, 
		ctx: ExecutionContext
	): Promise<Response> {
		const prisma = new PrismaClient({
			datasourceUrl:DATABASE_URL
		}).$extends(withAccelerate())
		

		const response = await prisma.log.create({
			data:{
				level:`info`,
				message: `${request.method} ${request.url}`,
				meta:{
					headers: JSON.stringify(request.headers)
				}
			}
		})
		// const response={msg:"hello"}

		const {data, info} = await prisma.log
		.findMany({
			take: 20,
			orderBy:{
				id: 'desc'
			}
		}).withAccelerateInfo()
		// return new Response(`request method: ${request.method}`);
		return Response.json({
			data,
			response
		});
	},
};
