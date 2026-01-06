import { useForm } from '@inertiajs/react';

export default function ForcePasswordChange() {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/force-password-change');
    }

    return (
        <form onSubmit={submit}>
            <input type="password" placeholder="Nova senha"
                onChange={e => setData('password', e.target.value)} />
            <input type="password" placeholder="Confirmar senha"
                onChange={e => setData('password_confirmation', e.target.value)} />
            <button disabled={processing}>Salvar</button>
        </form>
    );
}
