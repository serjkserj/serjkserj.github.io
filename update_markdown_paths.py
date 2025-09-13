import os
import re
from pathlib import Path

class MarkdownUpdater:
    def __init__(self, docs_folder, images_base_folder):
        self.docs_folder = Path(docs_folder)
        self.images_base_folder = Path(images_base_folder)
        self.document_mappings = {
            'ATR_Clashes Manager_Отработка коллизий_Архитекторам': 'clashes_manager',
            'ATR_Navisworks_Работа с коллизиями': 'navisworks',
            'ATR_Выгрузка  моделей 12.2 V.2': 'model_export',
            'ATR_Заполнение Код СВОР для архитекторов': 'svod_codes',
            'ATR_Подрезка коллизий_Revit Helper': 'clashes_helper'
        }
        
    def find_image_references(self, content):
        """Найти все ссылки на изображения в содержимом markdown"""
        # Ищем изображения в формате ![alt text](/path/to/image)
        image_pattern = r'!\[([^\]]*)\]\(([^)]+)\)'
        matches = re.findall(image_pattern, content)
        return matches
    
    def update_image_path(self, old_path, doc_name):
        """Обновить путь к изображению"""
        # Проверяем, это относительный путь или абсолютный
        if old_path.startswith('/'):
            # Абсолютный путь - убираем ведущий слэш
            old_path = old_path[1:]
        
        # Разбиваем путь на части
        path_parts = old_path.split('/')
        
        # Ищем имя файла в конце пути
        if len(path_parts) > 0:
            filename = path_parts[-1]
            
            # Получаем сокращенное имя документа
            doc_short_name = self.document_mappings.get(doc_name, doc_name.replace(' ', '_').lower())
            
            # Формируем новый путь
            new_path = f"/img/docs/images/{doc_short_name}/{filename}"
            return new_path
        
        return old_path
    
    def update_markdown_file(self, file_path):
        """Обновить пути к изображениям в markdown файле"""
        file_path = Path(file_path)
        if not file_path.exists():
            print(f"Файл не найден: {file_path}")
            return False
        
        # Определяем имя документа из имени файла
        doc_name = file_path.stem
        
        # Читаем содержимое файла
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Ошибка при чтении файла {file_path}: {e}")
            return False
        
        # Находим все ссылки на изображения
        image_refs = self.find_image_references(content)
        
        if not image_refs:
            print(f"В файле {file_path.name} не найдено ссылок на изображения")
            return True
        
        print(f"Обработка файла: {file_path.name}")
        print(f"Найдено ссылок на изображения: {len(image_refs)}")
        
        # Обновляем каждую ссылку
        updated_content = content
        changes_made = False
        
        for alt_text, old_path in image_refs:
            new_path = self.update_image_path(old_path, doc_name)
            
            if new_path != old_path:
                # Создаем шаблон для замены
                old_pattern = f'![{alt_text}]({old_path})'
                new_pattern = f'![{alt_text}]({new_path})'
                
                # Заменяем в содержимом
                updated_content = updated_content.replace(old_pattern, new_pattern)
                changes_made = True
                print(f"  Обновлен путь: {old_path} -> {new_path}")
        
        # Если были изменения, записываем файл обратно
        if changes_made:
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                print(f"Файл {file_path.name} успешно обновлен")
            except Exception as e:
                print(f"Ошибка при записи файла {file_path}: {e}")
                return False
        
        return changes_made
    
    def process_all_markdown_files(self):
        """Обработать все markdown файлы в папке"""
        if not self.docs_folder.exists():
            print(f"Папка не найдена: {self.docs_folder}")
            return
        
        # Находим все .md файлы
        md_files = list(self.docs_folder.glob('*.md'))
        
        if not md_files:
            print(f"В папке {self.docs_folder.name} не найдено markdown файлов")
            return
        
        print(f"Найдено markdown файлов: {len(md_files)}")
        
        # Обрабатываем каждый файл
        total_updated = 0
        for md_file in md_files:
            if self.update_markdown_file(md_file):
                total_updated += 1
        
        print(f"Обновлено файлов: {total_updated}/{len(md_files)}")

def main():
    # Пути к папкам
    docs_folder = 'docs'
    images_base_folder = 'static/docs/images'
    
    # Создаем обновляющий
    updater = MarkdownUpdater(docs_folder, images_base_folder)
    
    # Обрабатываем все markdown файлы
    updater.process_all_markdown_files()

if __name__ == "__main__":
    main()