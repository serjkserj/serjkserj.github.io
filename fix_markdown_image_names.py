import os
import re
from pathlib import Path

class MarkdownImageNameFixer:
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
    
    def get_image_mapping(self, doc_name):
        """Получить маппинг старых имен на новые для документа"""
        doc_short_name = self.document_mappings.get(doc_name, doc_name.replace(' ', '_').lower())
        
        # Получаем список всех изображений в папке документа
        doc_folder = self.images_base_folder / doc_short_name
        if not doc_folder.exists():
            return {}
        
        # Создаем маппинг старых имен на новые
        image_mapping = {}
        for image_file in doc_folder.glob('*.png'):
            # Старое имя - imageX.png, новое имя - doc_short_name_X.png
            old_name = f"image{image_file.stem.split('_')[-1]}.png"
            new_name = image_file.name
            image_mapping[old_name] = new_name
        
        return image_mapping
    
    def fix_image_names_in_content(self, content, doc_name):
        """Исправить имена изображений в содержимом"""
        # Получаем маппинг для документа
        image_mapping = self.get_image_mapping(doc_name)
        
        if not image_mapping:
            return content
        
        # Ищем все изображения в содержимом
        image_pattern = r'!\[([^\]]*)\]\((/img/docs/images/[^)]+\.png)\)'
        
        def replace_image(match):
            alt_text = match.group(1)
            image_path = match.group(2)
            
            # Извлекаем имя файла из пути
            filename = image_path.split('/')[-1]
            
            # Если имя есть в маппинге, заменяем
            if filename in image_mapping:
                new_filename = image_mapping[filename]
                new_path = image_path.replace(filename, new_filename)
                return f'![{alt_text}]({new_path})'
            
            return match.group(0)
        
        # Заменяем все изображения в содержимом
        new_content = re.sub(image_pattern, replace_image, content)
        
        return new_content
    
    def fix_markdown_file(self, file_path):
        """Исправить имена изображений в markdown файле"""
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
        
        # Исправляем имена изображений
        new_content = self.fix_image_names_in_content(content, doc_name)
        
        # Если были изменения, записываем файл обратно
        if new_content != content:
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Файл {file_path.name} успешно обновлен")
            except Exception as e:
                print(f"Ошибка при записи файла {file_path}: {e}")
                return False
        
        return True
    
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
            if self.fix_markdown_file(md_file):
                total_updated += 1
        
        print(f"Обновлено файлов: {total_updated}/{len(md_files)}")

def main():
    # Пути к папкам
    docs_folder = 'docs'
    images_base_folder = 'static/docs/images'
    
    # Создаем исправляющий
    fixer = MarkdownImageNameFixer(docs_folder, images_base_folder)
    
    # Обрабатываем все markdown файлы
    fixer.process_all_markdown_files()

if __name__ == "__main__":
    main()