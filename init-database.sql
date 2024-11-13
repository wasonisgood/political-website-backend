-- 設置客戶端字符集
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_database = utf8mb4;
SET character_set_results = utf8mb4;
SET character_set_server = utf8mb4;

-- 創建資料庫
DROP DATABASE IF EXISTS politics_website;
CREATE DATABASE politics_website
    DEFAULT CHARACTER SET utf8mb4 
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE politics_website;

-- 確保使用正確的字符集
ALTER DATABASE politics_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 創建政策類別表
CREATE TABLE IF NOT EXISTS policy_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 創建政策表
CREATE TABLE IF NOT EXISTS policies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    content TEXT,
    image_url VARCHAR(255),
    color_from VARCHAR(50) DEFAULT 'blue-400',
    color_to VARCHAR(50) DEFAULT 'blue-600',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES policy_categories(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 創建政策目標表
CREATE TABLE IF NOT EXISTS policy_objectives (
    id INT PRIMARY KEY AUTO_INCREMENT,
    policy_id INT NOT NULL,
    objective TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES policies(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 創建政策實施步驟表
CREATE TABLE IF NOT EXISTS policy_implementations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    policy_id INT NOT NULL,
    step TEXT NOT NULL,
    order_num INT NOT NULL,
    progress INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES policies(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 創建活動類別表
CREATE TABLE IF NOT EXISTS activity_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 創建活動表
CREATE TABLE IF NOT EXISTS activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time_start TIME,
    time_end TIME,
    location VARCHAR(255),
    image_url VARCHAR(255),
    external_link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES activity_categories(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 創建活動議程表
CREATE TABLE IF NOT EXISTS activity_agenda (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_id INT NOT NULL,
    time_slot VARCHAR(100),
    description TEXT NOT NULL,
    order_num INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 創建聯絡訊息表
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'processed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入基礎資料
-- 政策類別
START TRANSACTION;

INSERT INTO policy_categories (name) VALUES ('環境永續');
INSERT INTO policy_categories (name) VALUES ('科技創新');
INSERT INTO policy_categories (name) VALUES ('社會福利');

-- 活動類別
INSERT INTO activity_categories (name) VALUES ('政策說明會');
INSERT INTO activity_categories (name) VALUES ('社區服務');
INSERT INTO activity_categories (name) VALUES ('青年論壇');

-- 示例政策
INSERT INTO policies 
    (category_id, title, description, content, image_url, color_from, color_to) 
VALUES
    (1, '綠色能源政策', '推動可再生能源發展，減少碳排放', 
     '我們的綠色能源政策旨在加速台灣向可再生能源轉型...', 
     '/images/green-energy.webp', 'green-400', 'green-600');

INSERT INTO policies 
    (category_id, title, description, content, image_url, color_from, color_to) 
VALUES
    (2, '數位轉型計劃', '協助傳統產業進行數位化轉型', 
     '數位轉型計劃將幫助傳統產業導入現代化科技...', 
     '/images/digital-transformation.webp', 'purple-400', 'purple-600');

-- 政策目標
INSERT INTO policy_objectives (policy_id, objective) VALUES 
    (1, '到2030年，可再生能源占總發電量的30%'),
    (1, '減少碳排放，實現2050年碳中和目標');

INSERT INTO policy_objectives (policy_id, objective) VALUES 
    (2, '協助500家傳統產業完成數位轉型'),
    (2, '培育10000名數位人才');

-- 政策實施步驟
INSERT INTO policy_implementations (policy_id, step, order_num, progress) VALUES 
    (1, '完成法規制定', 1, 100),
    (1, '建置基礎設施', 2, 60);

INSERT INTO policy_implementations (policy_id, step, order_num, progress) VALUES 
    (2, '數位能力調查', 1, 100),
    (2, '人才培訓計劃', 2, 40);

-- 示例活動
INSERT INTO activities 
    (category_id, title, description, date, time_start, time_end, location) 
VALUES
    (1, '綠色能源政策說明會', '說明最新的綠能政策方向', 
     '2024-07-15', '14:00:00', '16:00:00', '台北市政府大禮堂');

INSERT INTO activities 
    (category_id, title, description, date, time_start, time_end, location) 
VALUES
    (3, '青年創業論壇', '探討數位時代的創業機會', 
     '2024-08-10', '09:00:00', '17:00:00', '台北 101 會議中心');

-- 活動議程
INSERT INTO activity_agenda (activity_id, time_slot, description, order_num) VALUES 
    (1, '14:00-14:30', '開幕致詞', 1),
    (1, '14:30-15:30', '政策說明', 2),
    (1, '15:30-16:00', '問答交流', 3);

INSERT INTO activity_agenda (activity_id, time_slot, description, order_num) VALUES 
    (2, '09:00-10:00', '開幕演講', 1),
    (2, '10:00-12:00', '創業經驗分享', 2),
    (2, '14:00-17:00', '工作坊', 3);

COMMIT;