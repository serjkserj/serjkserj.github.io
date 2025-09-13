import os
import re
from pathlib import Path
import shutil

class ImageRenamer:
    def __init__(self, images_folder):
        self.images_folder = Path(images_folder)
        self.document_mappings = {
            'clashes_manager': 'ATR_Clashes Manager_Отработка коллизий_Архитекторам',
            'navisworks': 'ATR_Navisworks_Работа с коллизиями',
            'model_export': 'ATR_Выгрузка  моделей 12.2 V.2',
            'svod_codes': 'ATR_Заполнение Код СВОР для архитекторов',
            'clashes_helper': 'ATR_Подрезка коллизий_Revit Helper'
        }
        
    def generate_image_name(self, doc_folder, image_number, image_path, description=""):
        """Сгенерировать имя изображения по формату [документ_сокращенный]_[порядковый_номер]_[краткое_описание].[расширение]"""
        doc_short_name = doc_folder.name
        extension = image_path.suffix.lower()
        
        # Очищаем описание от недопустимых символов
        if description:
            description = re.sub(r'[^\w\s-]', '', description).strip()
            description = re.sub(r'\s+', '_', description)
            if description:
                description = f"_{description}"
        
        # Генерируем имя
        new_name = f"{doc_short_name}_{image_number}{description}{extension}"
        return new_name
    
    def rename_images_in_folder(self, doc_folder):
        """Переименовать изображения в папке документа"""
        doc_folder = Path(doc_folder)
        if not doc_folder.exists() or not doc_folder.is_dir():
            print(f"Папка не найдена: {doc_folder}")
            return
        
        # Получаем все изображения в папке
        image_files = []
        for ext in ['*.png', '*.jpg', '*.jpeg', '*.gif', '*.bmp']:
            image_files.extend(doc_folder.glob(ext))
        
        if not image_files:
            print(f"В папке {doc_folder.name} не найдено изображений")
            return
        
        print(f"Обработка папки: {doc_folder.name}")
        print(f"Найдено изображений: {len(image_files)}")
        
        # Сортируем изображения по имени для сохранения порядка
        image_files.sort(key=lambda x: x.name.lower())
        
        # Переименовываем изображения
        for i, image_path in enumerate(image_files, 1):
            # Генерируем новое имя
            new_name = self.generate_image_name(doc_folder, i, image_path)
            new_path = doc_folder / new_name
            
            # Проверяем, не существует ли уже файл с таким именем
            if new_path.exists():
                print(f"Файл {new_name} уже существует, пропускаем")
                continue
            
            # Переименовываем файл
            try:
                image_path.rename(new_path)
                print(f"Переименовано: {image_path.name} -> {new_name}")
            except Exception as e:
                print(f"Ошибка при переименовании {image_path.name}: {e}")
    
    def process_all_folders(self):
        """Обработать все папки с изображениями"""
        if not self.images_folder.exists():
            print(f"Папка не найдена: {self.images_folder}")
            return
        
        # Получаем все папки в основной папке с изображениями
        doc_folders = [f for f in self.images_folder.iterdir() if f.is_dir()]
        
        if not doc_folders:
            print(f"В папке {self.images_folder.name} не найдено папок с документами")
            return
        
        print(f"Найдено папок с документами: {len(doc_folders)}")
        
        # Обрабатываем каждую папку
        for doc_folder in doc_folders:
            self.rename_images_in_folder(doc_folder)
        
        print("Переименование изображений завершено")

def main():
    # Путь к папке с изображениями
    images_folder = 'static/docs/images'
    
    # Создаем переименовщик
    renamer = ImageRenamer(images_folder)
    
    # Обрабатываем все папки
    renamer.process_all_folders()

if __name__ == "__main__":
    main()