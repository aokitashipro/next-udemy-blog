'use server'

import { registerSchema } from "@/validations/user"
import { prisma } from '@/lib/prisma'
import bcryptjs from 'bcryptjs'
import { signIn } from "@/auth"
import { redirect } from 'next/navigation'
import { ZodError } from 'zod'

type ActionState = {
    success: boolean,
    errors: Record<string, string[]>
}

// バリデーションエラー処理
function handleValidationError(error: ZodError): ActionState {
    const { fieldErrors, formErrors } = error.flatten();
    const castedFieldErrors = fieldErrors as Record<string, string[]>;
    // zodの仕様でパスワード一致確認のエラーは formErrorsで渡ってくる
  // formErrorsがある場合は、confirmPasswordフィールドにエラーを追加
    if (formErrors.length > 0) {
      return { success: false, errors: { ...fieldErrors, confirmPassword: formErrors
        }}}
    return { success: false, errors: castedFieldErrors };
  }
  
  // カスタムエラー処理
  function handleError(customErrors: Record<string, string[]>): ActionState {
    return { success: false, errors: customErrors };
  }

export async function createUser(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState>
{
    // フォームから渡ってきた情報を取得
    const rawFormData = Object.fromEntries(
        ["name", "email", "password", "confirmPassword"].map(field =>[
            field,
            formData.get(field) as string
        ])
    ) as Record<string, string>

    // バリデーション
    const validationResult = registerSchema.safeParse(rawFormData)
    if(!validationResult.success){
        return handleValidationError(validationResult.error)
    }

    // DBにメールアドレスが存在しているかの確認
    const existingUser = await prisma.user.findUnique({
        where : { email: rawFormData.email }
    })
    if(existingUser){
        return handleError({email: ['このメールアドレスはすでに登録されています。']})
    }

    // DBに登録
    const hashedPassword = await bcryptjs.hash(rawFormData.password, 12)

    await prisma.user.create({
        data: {
            name: rawFormData.name,
            email: rawFormData.email,
            password: hashedPassword
        }
    })

    // dashboardにリダイレクト
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false
    })

    redirect('/dashboard')
}