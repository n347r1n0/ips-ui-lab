// frontend/src/App.jsx

import React, { useState } from 'react';
import { PageShell } from './ui/layout/PageShell';
import { Section } from './ui/layout/Section';
import { Toolbar } from './ui/layout/Toolbar';

import { GlassPanel } from './ui/surfaces/GlassPanel';
import { Modal } from './ui/surfaces/Modal';

import { Button } from './ui/primitives/Button';
import { Input } from './ui/primitives/Input';
import { Select } from './ui/primitives/Select';

import { Spinner } from './ui/feedback/Spinner';
import { EmptyState } from './ui/feedback/EmptyState';
import { ErrorState } from './ui/feedback/ErrorState';

import { FontsModal } from './ui/demos/FontsModal';
import { useToast } from './ui/surfaces/Toast';
import { Inbox } from 'lucide-react';

export default function App() {
  const [open, setOpen] = useState(false);
  const [fontsOpen, setFontsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', contactType: 'telegram', contact: '' });
  const [errors, setErrors] = useState({});
  const [items, setItems] = useState([]);
  const toast = useToast();

  const onSave = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Введите имя';
    if (!form.contact.trim()) next.contact = 'Укажите контакт';
    setErrors(next);
    if (Object.keys(next).length) {
      toast.danger(Object.values(next)[0], { title: 'Ошибка валидации' });
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setOpen(false);
      toast.success('Данные успешно сохранены!', { title: 'Успех' });
    }, 1000);
  };

  return (
    <PageShell>
      {/* Верхняя панель (можно прилипать sticky при желании) */}
      <Section y="tight" className="pt-6">
        <Toolbar className="justify-between">
          <div className="font-brand text-[--fg-strong]">
            IPS UI Lab
          </div>
          <div className="flex gap-2">
            <Button variant="glass" onClick={() => setFontsOpen(true)}>Fonts modal</Button>
            <Button onClick={() => setOpen(true)}>Open modal</Button>
          </div>
        </Toolbar>
      </Section>

      {/* Панель №1 — базовые кнопки и вызовы модалок */}
      <Section>
        <GlassPanel className="mx-auto max-w-md p-6">
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
      </Section>

      {/* Панель №2 — демо EmptyState со списком */}
      <Section y="tight">
        <GlassPanel className="mx-auto max-w-md p-6">
          <div className="text-[--fg-strong] font-semibold mb-3">EmptyState demo</div>

          {items.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Пока здесь пусто"
              subtitle="Добавьте первый элемент или откройте модалки."
              action={
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setItems(['Элемент 1'])}>Добавить</Button>
                  <Button variant="glass" onClick={() => setOpen(true)}>Открыть форму</Button>
                  <Button variant="glass" onClick={() => setFontsOpen(true)}>Открыть FontsModal</Button>
                </div>
              }
            />
          ) : (
            <div className="space-y-2">
              {items.map((it, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                  {it}
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="glass" onClick={() => setItems([])}>Очистить</Button>
                <Button onClick={() => setItems(prev => [...prev, `Элемент ${prev.length + 1}`])}>
                  Добавить
                </Button>
              </div>
            </div>
          )}
        </GlassPanel>
      </Section>

      {/* Панель №3 — ErrorState демо */}
      <Section y="tight">
        <GlassPanel className="mx-auto max-w-md p-6">
          <ErrorState
            title="Не удалось загрузить список"
            message="Проверь соединение и попробуйте снова."
            onRetry={() => toast.info('Повтор запроса...')}
          />
        </GlassPanel>
      </Section>

      {/* Основная модалка с формой */}
      <Modal open={open} onClose={() => setOpen(false)} size="md">
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
              onChange={(e) => setForm((s) => ({ ...s, contactType: e.target.value }))}
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
              onChange={(e) => setForm((s) => ({ ...s, contact: e.target.value }))}
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

      {/* Модалка предпросмотра ролей шрифтов */}
      <FontsModal open={fontsOpen} onClose={() => setFontsOpen(false)} />
    </PageShell>
  );
}
