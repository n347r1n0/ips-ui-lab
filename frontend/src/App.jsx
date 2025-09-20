// frontend/src/App.jsx

import React, { useState } from 'react';
import { GlassPanel } from './ui/surfaces/GlassPanel';
import { Button } from './ui/primitives/Button';
import { Modal } from './ui/surfaces/Modal';
import { Input } from './ui/primitives/Input';
import { Select } from './ui/primitives/Select';
import { Spinner } from './ui/feedback/Spinner';
import { FontsModal } from './ui/demos/FontsModal';
import { useToast } from './ui/surfaces/Toast'; // Импортируем хук
import { EmptyState } from './ui/feedback/EmptyState';
import { Inbox } from 'lucide-react';

export default function App() {
  const [open, setOpen] = useState(false);
  const [fontsOpen, setFontsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', contactType: 'telegram', contact: '' });
  const [errors, setErrors] = useState({});
  const toast = useToast(); // Активируем хук

  const onSave = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Введите имя';
    if (!form.contact.trim()) next.contact = 'Укажите контакт';
    setErrors(next);
    if (Object.keys(next).length) {
      // Показываем ошибку через тост
      toast.danger(Object.values(next)[0], { title: 'Ошибка валидации' });
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setOpen(false);
      toast.success('Данные успешно сохранены!', { title: 'Успех' }); // Заменяем alert
    }, 1000);
  };

  return (
    <div className="p-6">
      <GlassPanel className="max-w-md">
        {/* Применяем класс для бренд-шрифта */}
        <h1 className="font-brand text-2xl font-bold text-[--fg-strong]">IPS UI Lab</h1>
        <p className="text-[--fg] opacity-80 mt-1">
          Токены подключены, стекло и кнопки работают.
        </p>

        <div className="flex gap-2 mt-4">
          <Button>Primary</Button>
          <Button variant="glass">Cancel</Button>
          <Button variant="neutral">Neutral</Button>
          <Button onClick={() => setOpen(true)} className="ml-auto">
            Open modal
          </Button>
          <Button variant="glass" onClick={() => setFontsOpen(true)}>Fonts modal</Button>
        </div>
      </GlassPanel>

      <GlassPanel className="mt-6 p-6">
        <EmptyState
          icon={Inbox}
          title="Пока здесь пусто"
          subtitle="Загрузки ещё не было. Попробуй открыть модалку или посмотреть шрифты."
          action={
            <div className="flex gap-2 justify-center">
              <Button variant="glass" onClick={() => setOpen(true)}>Добавить</Button>
              <Button onClick={() => setFontsOpen(true)}>Открыть FontsModal</Button>
            </div>
          }
        />
      </GlassPanel>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header onClose={() => setOpen(false)}>
          <span className="font-brand">Демо-модалка</span>
        </Modal.Header>
        <Modal.Body>
          <form className="space-y-4" onSubmit={onSave} noValidate>
            <Input
              id="name"
              label="Имя"
              placeholder="Иван"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              error={errors.name}
              variant="glass"
            />
            <Select
              id="ctype"
              label="Тип контакта"
              value={form.contactType}
              onChange={(e) =>
                setForm((s) => ({ ...s, contactType: e.target.value }))
              }
              hint="Telegram предпочтительно"
              variant="glass"
            >
              <option value="telegram">Telegram</option>
              <option value="phone">Телефон</option>
              <option value="email">Email</option>
            </Select>
            <Input
              id="contact"
              label="Контакт"
              placeholder="@username или +7…"
              value={form.contact}
              onChange={(e) =>
                setForm((s) => ({ ...s, contact: e.target.value }))
              }
              error={errors.contact}
              variant="glass"
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="glass" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving && <Spinner className="mr-2" />} Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
      <FontsModal open={fontsOpen} onClose={() => setFontsOpen(false)} />
    </div>
  );
}