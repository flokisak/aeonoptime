// Čeština-Čínština - Gamifikovaná aplikace pro učení čínštiny

// ==================== DATA ====================

// Slovní zásoba s českými překlady - Rozšířená verze
const vocabulary = [
    // Základy (1-15)
    { id: 1, chinese: '你好', pinyin: 'nǐ hǎo', czech: 'Ahoj', category: 'basics', example: '你好！(Ahoj!)', strokes: 6 },
    { id: 2, chinese: '谢谢', pinyin: 'xiè xie', czech: 'Děkuji', category: 'basics', example: '谢谢你！(Děkuji ti!)', strokes: 12 },
    { id: 3, chinese: '再见', pinyin: 'zài jiàn', czech: 'Na shledanou', category: 'basics', example: '明天见！(Uvidíme se zítra!)', strokes: 10 },
    { id: 4, chinese: '是', pinyin: 'shì', czech: 'Být (ano)', category: 'basics', example: '我是学生。(Jsem student.)', strokes: 9 },
    { id: 5, chinese: '不', pinyin: 'bù', czech: 'Ne / Nebýt', category: 'basics', example: '我不是老师。(Nejsem učitel.)', strokes: 4 },
    { id: 6, chinese: '好', pinyin: 'hǎo', czech: 'Dobrý', category: 'basics', example: '很好！(Velmi dobré!)', strokes: 6 },
    { id: 7, chinese: '我', pinyin: 'wǒ', czech: 'Já', category: 'basics', example: '我是捷克人。(Jsem Čech.)', strokes: 7 },
    { id: 8, chinese: '你', pinyin: 'nǐ', czech: 'Ty', category: 'basics', example: '你好吗？(Jak se máš?)', strokes: 7 },
    { id: 9, chinese: '什么', pinyin: 'shén me', czech: 'Co / Jaký', category: 'basics', example: '这是什么？(Co je to?)', strokes: 10 },
    { id: 10, chinese: '吗', pinyin: 'ma', czech: '(tázací částice)', category: 'basics', example: '你好吗？(Jak se máš?)', strokes: 6 },
    { id: 11, chinese: '很', pinyin: 'hěn', czech: 'Velmi', category: 'basics', example: '很好 (velmi dobré)', strokes: 9 },
    { id: 12, chinese: '的', pinyin: 'de', czech: '(přivlastňovací částice)', category: 'basics', example: '我的书 (moje kniha)', strokes: 8 },
    { id: 13, chinese: '也', pinyin: 'yě', czech: 'Také', category: 'basics', example: '我也是。(Já také.)', strokes: 3 },
    { id: 14, chinese: '会', pinyin: 'huì', czech: 'Umět / Budu', category: 'basics', example: '我会说中文。(Umím čínsky.)', strokes: 6 },
    { id: 15, chinese: '想', pinyin: 'xiǎng', czech: 'Chtít / Myslet', category: 'basics', example: '我想学习。(Chci se učit.)', strokes: 13 },
    
    // Čísla (16-35)
    { id: 16, chinese: '一', pinyin: 'yī', czech: 'Jedna', category: 'numbers', example: '一个人 (jeden člověk)', strokes: 1 },
    { id: 17, chinese: '二', pinyin: 'èr', czech: 'Dva', category: 'numbers', example: '两个人 (dva lidé)', strokes: 2 },
    { id: 18, chinese: '三', pinyin: 'sān', czech: 'Tři', category: 'numbers', example: '三个人 (tři lidé)', strokes: 3 },
    { id: 19, chinese: '四', pinyin: 'sì', czech: 'Čtyři', category: 'numbers', example: '四本书 (čtyři knihy)', strokes: 5 },
    { id: 20, chinese: '五', pinyin: 'wǔ', czech: 'Pět', category: 'numbers', example: '五天 (pět dní)', strokes: 4 },
    { id: 21, chinese: '六', pinyin: 'liù', czech: 'Šest', category: 'numbers', example: '六个月 (šest měsíců)', strokes: 4 },
    { id: 22, chinese: '七', pinyin: 'qī', czech: 'Sedm', category: 'numbers', example: '七天 (sedm dní)', strokes: 2 },
    { id: 23, chinese: '八', pinyin: 'bā', czech: 'Osm', category: 'numbers', example: '八个人 (osm lidí)', strokes: 2 },
    { id: 24, chinese: '九', pinyin: 'jiǔ', czech: 'Devět', category: 'numbers', example: '九天 (devět dní)', strokes: 2 },
    { id: 25, chinese: '十', pinyin: 'shí', czech: 'Deset', category: 'numbers', example: '十天 (deset dní)', strokes: 2 },
    { id: 26, chinese: '百', pinyin: 'bǎi', czech: 'Sto', category: 'numbers', example: '一百 (sto)', strokes: 6 },
    { id: 27, chinese: '千', pinyin: 'qiān', czech: 'Tisíc', category: 'numbers', example: '一千 (tisíc)', strokes: 3 },
    { id: 28, chinese: '万', pinyin: 'wàn', czech: 'Deset tisíc', category: 'numbers', example: '一万 (deset tisíc)', strokes: 3 },
    { id: 29, chinese: '零', pinyin: 'líng', czech: 'Nula', category: 'numbers', example: '零度 (nula stupňů)', strokes: 13 },
    { id: 30, chinese: '第一', pinyin: 'dì yī', czech: 'První', category: 'numbers', example: '第一名 (první místo)', strokes: 8 },
    { id: 31, chinese: '第二', pinyin: 'dì èr', czech: 'Druhý', category: 'numbers', example: '第二天 (druhý den)', strokes: 8 },
    { id: 32, chinese: '第三', pinyin: 'dì sān', czech: 'Třetí', category: 'numbers', example: '第三次 (potřetí)', strokes: 9 },
    { id: 33, chinese: '多少', pinyin: 'duō shao', czech: 'Kolik', category: 'numbers', example: '多少钱？(Kolik to stojí?)', strokes: 12 },
    { id: 34, chinese: '几', pinyin: 'jǐ', czech: 'Kolik (malé číslo)', category: 'numbers', example: '几个人？(Kolik lidí?)', strokes: 2 },
    { id: 35, chinese: '半', pinyin: 'bàn', czech: 'Polovina', category: 'numbers', example: '一半 (polovina)', strokes: 5 },
    
    // Pozdravy a zdvořilost (36-50)
    { id: 36, chinese: '早上好', pinyin: 'zǎo shang hǎo', czech: 'Dobré ráno', category: 'greetings', example: '早上好！(Dobré ráno!)', strokes: 12 },
    { id: 37, chinese: '晚上好', pinyin: 'wǎn shang hǎo', czech: 'Dobrý večer', category: 'greetings', example: '晚上好！(Dobrý večer!)', strokes: 12 },
    { id: 38, chinese: '欢迎', pinyin: 'huān yíng', czech: 'Vítejte', category: 'greetings', example: '欢迎光临！(Vítejte!)', strokes: 10 },
    { id: 39, chinese: '请', pinyin: 'qǐng', czech: 'Prosím', category: 'greetings', example: '请坐。(Prosím, sedněte si.)', strokes: 10 },
    { id: 40, chinese: '对不起', pinyin: 'duì bu qǐ', czech: 'Promiňte', category: 'greetings', example: '对不起，我迟到了。(Promiňte, zpozdil jsem se.)', strokes: 12 },
    { id: 41, chinese: '没关系', pinyin: 'méi guān xi', czech: 'To nevadí', category: 'greetings', example: '没关系！(To nevadí!)', strokes: 10 },
    { id: 42, chinese: '不好意思', pinyin: 'bù hǎo yì si', czech: 'Omlouvám se', category: 'greetings', example: '不好意思打扰了。(Omlouvám se za vyrušení.)', strokes: 14 },
    { id: 43, chinese: '欢迎再来', pinyin: 'huān yíng zài lái', czech: 'Zase vítány', category: 'greetings', example: '欢迎再来！(Zase vítány!)', strokes: 16 },
    { id: 44, chinese: '慢走', pinyin: 'màn zǒu', czech: 'Opatrně cestou', category: 'greetings', example: '您慢走！(Opatrně cestou!)', strokes: 11 },
    { id: 45, chinese: '好久不见', pinyin: 'hǎo jiǔ bù jiàn', czech: 'Dlouho jsme se neviděli', category: 'greetings', example: '好久不见！(Dlouho jsme se neviděli!)', strokes: 13 },
    { id: 46, chinese: '最近怎么样', pinyin: 'zuì jìn zěn me yàng', czech: 'Jak se máš?', category: 'greetings', example: '最近怎么样？(Jak se máš?)', strokes: 17 },
    { id: 47, chinese: '很高兴认识你', pinyin: 'hěn gāo xìng rèn shi nǐ', czech: 'Rád tě poznávám', category: 'greetings', example: '很高兴认识你！(Rád tě poznávám!)', strokes: 22 },
    { id: 48, chinese: '祝你愉快', pinyin: 'zhù nǐ yú kuài', czech: 'Přeji ti hezký den', category: 'greetings', example: '祝你愉快！(Přeji ti hezký den!)', strokes: 16 },
    { id: 49, chinese: '保重', pinyin: 'bǎo zhòng', czech: 'Opatruj se', category: 'greetings', example: '多保重！(Opatruj se!)', strokes: 9 },
    { id: 50, chinese: '一路顺风', pinyin: 'yī lù shùn fēng', czech: 'Šťastnou cestu', category: 'greetings', example: '一路顺风！(Šťastnou cestu!)', strokes: 13 },
    
    // Jídlo a pití (51-70)
    { id: 51, chinese: '水', pinyin: 'shuǐ', czech: 'Voda', category: 'food', example: '我要水。(Chci vodu.)', strokes: 4 },
    { id: 52, chinese: '茶', pinyin: 'chá', czech: 'Čaj', category: 'food', example: '我喜欢喝茶。(Rád piji čaj.)', strokes: 9 },
    { id: 53, chinese: '饭', pinyin: 'fàn', czech: 'Rýže / Jídlo', category: 'food', example: '吃饭了吗？(Jedl jsi?)', strokes: 7 },
    { id: 54, chinese: '面', pinyin: 'miàn', czech: 'Nudle', category: 'food', example: '我要面条。(Chci nudle.)', strokes: 9 },
    { id: 55, chinese: '肉', pinyin: 'ròu', czech: 'Maso', category: 'food', example: '我不吃肉。(Nejím maso.)', strokes: 6 },
    { id: 56, chinese: '鱼', pinyin: 'yú', czech: 'Ryba', category: 'food', example: '鱼很好吃。(Ryba je chutná.)', strokes: 8 },
    { id: 57, chinese: '菜', pinyin: 'cài', czech: 'Zelenina / Jídlo', category: 'food', example: '这个菜很好吃。(Toto jídlo je chutné.)', strokes: 11 },
    { id: 58, chinese: '水果', pinyin: 'shuǐ guǒ', czech: 'Ovoce', category: 'food', example: '我喜欢吃水果。(Rád jím ovoce.)', strokes: 12 },
    { id: 59, chinese: '苹果', pinyin: 'píng guǒ', czech: 'Jablko', category: 'food', example: '一个苹果 (jedno jablko)', strokes: 13 },
    { id: 60, chinese: '香蕉', pinyin: 'xiāng jiāo', czech: 'Banán', category: 'food', example: '香蕉很甜。(Banán je sladký.)', strokes: 15 },
    { id: 61, chinese: '咖啡', pinyin: 'kā fēi', czech: 'Káva', category: 'food', example: '一杯咖啡 (šálek kávy)', strokes: 14 },
    { id: 62, chinese: '啤酒', pinyin: 'pí jiǔ', czech: 'Pivo', category: 'food', example: '一杯啤酒 (sklenice piva)', strokes: 12 },
    { id: 63, chinese: '牛奶', pinyin: 'niú nǎi', czech: 'Mléko', category: 'food', example: '一杯牛奶 (sklenice mléka)', strokes: 10 },
    { id: 64, chinese: '鸡蛋', pinyin: 'jī dàn', czech: 'Vejce', category: 'food', example: '两个鸡蛋 (dvě vejce)', strokes: 13 },
    { id: 65, chinese: '面包', pinyin: 'miàn bāo', czech: 'Chléb', category: 'food', example: '一片面包 (plátek chleba)', strokes: 14 },
    { id: 66, chinese: '米饭', pinyin: 'mǐ fàn', czech: 'Vařená rýže', category: 'food', example: '一碗米饭 (miska rýže)', strokes: 13 },
    { id: 67, chinese: '饺子', pinyin: 'jiǎo zi', czech: 'Knedlíčky', category: 'food', example: '吃饺子 (jíst knedlíčky)', strokes: 15 },
    { id: 68, chinese: '汤', pinyin: 'tāng', czech: 'Polévka', category: 'food', example: '一碗汤 (miska polévky)', strokes: 12 },
    { id: 69, chinese: '糖', pinyin: 'táng', czech: 'Cukr', category: 'food', example: '加糖 (přidat cukr)', strokes: 16 },
    { id: 70, chinese: '盐', pinyin: 'yán', czech: 'Sůl', category: 'food', example: '加点盐 (přidat trochu soli)', strokes: 13 },
    
    // Cestování (71-90)
    { id: 71, chinese: '车站', pinyin: 'chē zhàn', czech: 'Nádraží', category: 'travel', example: '火车站在哪里？(Kde je nádraží?)', strokes: 12 },
    { id: 72, chinese: '机场', pinyin: 'jī chǎng', czech: 'Letiště', category: 'travel', example: '去机场 (jet na letiště)', strokes: 12 },
    { id: 73, chinese: '酒店', pinyin: 'jiǔ diàn', czech: 'Hotel', category: 'travel', example: '我要订酒店。(Chci rezervovat hotel.)', strokes: 13 },
    { id: 74, chinese: '地图', pinyin: 'dì tú', czech: 'Mapa', category: 'travel', example: '给我看看地图。(Ukaž mi mapu.)', strokes: 11 },
    { id: 75, chinese: '票', pinyin: 'piào', czech: 'Lístek', category: 'travel', example: '我要买票。(Chci koupit lístek.)', strokes: 11 },
    { id: 76, chinese: '火车', pinyin: 'huǒ chē', czech: 'Vlak', category: 'travel', example: '坐火车 (jet vlakem)', strokes: 10 },
    { id: 77, chinese: '飞机', pinyin: 'fēi jī', czech: 'Letadlo', category: 'travel', example: '坐飞机 (letět letadlem)', strokes: 12 },
    { id: 78, chinese: '出租车', pinyin: 'chū zū chē', czech: 'Taxi', category: 'travel', example: '叫出租车 (zavolat taxi)', strokes: 13 },
    { id: 79, chinese: '公共汽车', pinyin: 'gōng gòng qì chē', czech: 'Autobus', category: 'travel', example: '坐公共汽车 (jet autobusem)', strokes: 16 },
    { id: 80, chinese: '地铁', pinyin: 'dì tiě', czech: 'Metro', category: 'travel', example: '坐地铁 (jet metrem)', strokes: 10 },
    { id: 81, chinese: '路', pinyin: 'lù', czech: 'Cesta / Ulice', category: 'travel', example: '这条路 (tato ulice)', strokes: 13 },
    { id: 82, chinese: '左边', pinyin: 'zuǒ biān', czech: 'Vlevo', category: 'travel', example: '往左边走 (jít vlevo)', strokes: 10 },
    { id: 83, chinese: '右边', pinyin: 'yòu biān', czech: 'Vpravo', category: 'travel', example: '往右边走 (jít vpravo)', strokes: 10 },
    { id: 84, chinese: '前面', pinyin: 'qián miàn', czech: 'Vpředu', category: 'travel', example: '在前面 (být vpředu)', strokes: 13 },
    { id: 85, chinese: '后面', pinyin: 'hòu miàn', czech: 'Vzadu', category: 'travel', example: '在后面 (být vzadu)', strokes: 13 },
    { id: 86, chinese: '哪里', pinyin: 'nǎ lǐ', czech: 'Kde', category: 'travel', example: '在哪里？(Kde?)', strokes: 9 },
    { id: 87, chinese: '这里', pinyin: 'zhè lǐ', czech: 'Tady', category: 'travel', example: '在这里 (být tady)', strokes: 10 },
    { id: 88, chinese: '那里', pinyin: 'nà lǐ', czech: 'Tam', category: 'travel', example: '在那里 (být tam)', strokes: 9 },
    { id: 89, chinese: '远', pinyin: 'yuǎn', czech: 'Daleko', category: 'travel', example: '很远 (velmi daleko)', strokes: 7 },
    { id: 90, chinese: '近', pinyin: 'jìn', czech: 'Blízko', category: 'travel', example: '很近 (velmi blízko)', strokes: 7 },
    
    // Rodina (91-105)
    { id: 91, chinese: '爸爸', pinyin: 'bà ba', czech: 'Táta', category: 'family', example: '我爸爸是医生。(Můj táta je lékař.)', strokes: 8 },
    { id: 92, chinese: '妈妈', pinyin: 'mā ma', czech: 'Máma', category: 'family', example: '我妈妈是老师。(Moje máma je učitelka.)', strokes: 8 },
    { id: 93, chinese: '哥哥', pinyin: 'gē ge', czech: 'Starší bratr', category: 'family', example: '我有一个哥哥。(Mám jednoho staršího bratra.)', strokes: 10 },
    { id: 94, chinese: '姐姐', pinyin: 'jiě jie', czech: 'Starší sestra', category: 'family', example: '我姐姐很漂亮。(Moje starší sestra je krásná.)', strokes: 10 },
    { id: 95, chinese: '弟弟', pinyin: 'dì di', czech: 'Mladší bratr', category: 'family', example: '我弟弟还小。(Můj mladší bratr je ještě malý.)', strokes: 10 },
    { id: 96, chinese: '妹妹', pinyin: 'mèi mei', czech: 'Mladší sestra', category: 'family', example: '我妹妹很可爱。(Moje mladší sestra je roztomilá.)', strokes: 10 },
    { id: 97, chinese: '爷爷', pinyin: 'yé ye', czech: 'Děda (z otcovy strany)', category: 'family', example: '我爷爷八十岁了。(Mému dědovi je 80 let.)', strokes: 12 },
    { id: 98, chinese: '奶奶', pinyin: 'nǎi nai', czech: 'Babička (z otcovy strany)', category: 'family', example: '我奶奶很慈祥。(Moje babička je laskavá.)', strokes: 10 },
    { id: 99, chinese: '外公', pinyin: 'wài gōng', czech: 'Děda (z matčiny strany)', category: 'family', example: '外公住在乡下。(Děda bydlí na venkově.)', strokes: 9 },
    { id: 100, chinese: '外婆', pinyin: 'wài pó', czech: 'Babička (z matčiny strany)', category: 'family', example: '外婆做的菜很好吃。(Babiččino jídlo je chutné.)', strokes: 10 },
    { id: 101, chinese: '儿子', pinyin: 'ér zi', czech: 'Syn', category: 'family', example: '他是我的儿子。(Je to můj syn.)', strokes: 7 },
    { id: 102, chinese: '女儿', pinyin: 'nǚ ér', czech: 'Dcera', category: 'family', example: '她是我女儿。(Je to moje dcera.)', strokes: 7 },
    { id: 103, chinese: '丈夫', pinyin: 'zhàng fu', czech: 'Manžel', category: 'family', example: '我丈夫是工程师。(Můj manžel je inženýr.)', strokes: 10 },
    { id: 104, chinese: '妻子', pinyin: 'qī zi', czech: 'Manželka', category: 'family', example: '我妻子是医生。(Moje manželka je lékařka.)', strokes: 8 },
    { id: 105, chinese: '家庭', pinyin: 'jiā tíng', czech: 'Rodina', category: 'family', example: '我有一个幸福的家庭。(Mám šťastnou rodinu.)', strokes: 13 },
    
    // Čas a datum (106-120)
    { id: 106, chinese: '今天', pinyin: 'jīn tiān', czech: 'Dnes', category: 'time', example: '今天天气很好。(Dnes je hezky.)', strokes: 8 },
    { id: 107, chinese: '明天', pinyin: 'míng tiān', czech: 'Zítra', category: 'time', example: '明天见！(Uvidíme se zítra!)', strokes: 9 },
    { id: 108, chinese: '后天', pinyin: 'hòu tiān', czech: 'Pozítří', category: 'time', example: '后天有空吗？(Máš pozítří čas?)', strokes: 9 },
    { id: 109, chinese: '昨天', pinyin: 'zuó tiān', czech: 'Včera', category: 'time', example: '昨天很忙。(Včera jsem byl zaneprázdněný.)', strokes: 9 },
    { id: 110, chinese: '前天', pinyin: 'qián tiān', czech: 'Předevčírem', category: 'time', example: '前天见过他。(Viděl jsem ho předevčírem.)', strokes: 9 },
    { id: 111, chinese: '现在', pinyin: 'xiàn zài', czech: 'Teď', category: 'time', example: '现在几点？(Kolik je teď hodin?)', strokes: 12 },
    { id: 112, chinese: '以后', pinyin: 'yǐ hòu', czech: 'Poté / V budoucnosti', category: 'time', example: '以后再说。(Řekneme si to později.)', strokes: 10 },
    { id: 113, chinese: '以前', pinyin: 'yǐ qián', czech: 'Dříve', category: 'time', example: '以前住在这里。(Dříve jsem bydlel tady.)', strokes: 10 },
    { id: 114, chinese: '早上', pinyin: 'zǎo shang', czech: 'Ráno', category: 'time', example: '早上六点 (v šest ráno)', strokes: 9 },
    { id: 115, chinese: '中午', pinyin: 'zhōng wǔ', czech: 'Poledne', category: 'time', example: '中午十二点 (ve dvanáct v poledne)', strokes: 8 },
    { id: 116, chinese: '下午', pinyin: 'xià wǔ', czech: 'Odpoledne', category: 'time', example: '下午三点 (ve tři odpoledne)', strokes: 8 },
    { id: 117, chinese: '晚上', pinyin: 'wǎn shang', czech: 'Večer', category: 'time', example: '晚上八点 (v osm večer)', strokes: 9 },
    { id: 118, chinese: '星期', pinyin: 'xīng qī', czech: 'Týden', category: 'time', example: '一个星期 (jeden týden)', strokes: 12 },
    { id: 119, chinese: '月', pinyin: 'yuè', czech: 'Měsíc', category: 'time', example: '一个月 (jeden měsíc)', strokes: 4 },
    { id: 120, chinese: '年', pinyin: 'nián', czech: 'Rok', category: 'time', example: '一年 (jeden rok)', strokes: 6 },
    
    // Barvy (121-130)
    { id: 121, chinese: '红色', pinyin: 'hóng sè', czech: 'Červená', category: 'colors', example: '红色的花 (červený květ)', strokes: 12 },
    { id: 122, chinese: '蓝色', pinyin: 'lán sè', czech: 'Modrá', category: 'colors', example: '蓝色的天空 (modrá obloha)', strokes: 14 },
    { id: 123, chinese: '绿色', pinyin: 'lǜ sè', czech: 'Zelená', category: 'colors', example: '绿色的树 (zelený strom)', strokes: 14 },
    { id: 124, chinese: '黄色', pinyin: 'huáng sè', czech: 'Žlutá', category: 'colors', example: '黄色的香蕉 (žlutý banán)', strokes: 14 },
    { id: 125, chinese: '白色', pinyin: 'bái sè', czech: 'Bílá', category: 'colors', example: '白色的雪 (bílý sníh)', strokes: 10 },
    { id: 126, chinese: '黑色', pinyin: 'hēi sè', czech: 'Černá', category: 'colors', example: '黑色的猫 (černá kočka)', strokes: 14 },
    { id: 127, chinese: '灰色', pinyin: 'huī sè', czech: 'Šedá', category: 'colors', example: '灰色的云 (šedý mrak)', strokes: 13 },
    { id: 128, chinese: '紫色', pinyin: 'zǐ sè', czech: 'Fialová', category: 'colors', example: '紫色的葡萄 (fialové hrozny)', strokes: 13 },
    { id: 129, chinese: '橙色', pinyin: 'chéng sè', czech: 'Oranžová', category: 'colors', example: '橙色的橘子 (oranžový pomeranč)', strokes: 13 },
    { id: 130, chinese: '粉色', pinyin: 'fěn sè', czech: 'Růžová', category: 'colors', example: '粉色的裙子 (růžová sukně)', strokes: 13 },
    
    // Počasí (131-140)
    { id: 131, chinese: '天气', pinyin: 'tiān qì', czech: 'Počasí', category: 'weather', example: '今天天气很好。(Dnes je hezky.)', strokes: 8 },
    { id: 132, chinese: '晴天', pinyin: 'qíng tiān', czech: 'Slunečno', category: 'weather', example: '今天是晴天。(Dnes je slunečno.)', strokes: 10 },
    { id: 133, chinese: '雨天', pinyin: 'yǔ tiān', czech: 'Deštivo', category: 'weather', example: '雨天要带伞。(V dešti potřebuješ deštník.)', strokes: 10 },
    { id: 134, chinese: '多云', pinyin: 'duō yún', czech: 'Oblačno', category: 'weather', example: '今天多云。(Dnes je oblačno.)', strokes: 10 },
    { id: 135, chinese: '下雪', pinyin: 'xià xuě', czech: 'Sněžit', category: 'weather', example: '外面在下雪。(Venku sněží.)', strokes: 10 },
    { id: 136, chinese: '下雨', pinyin: 'xià yǔ', czech: 'Pršet', category: 'weather', example: '在下雨。(Prší.)', strokes: 10 },
    { id: 137, chinese: '风', pinyin: 'fēng', czech: 'Vítr', category: 'weather', example: '今天有风。(Dnes fouká vítr.)', strokes: 4 },
    { id: 138, chinese: '热', pinyin: 'rè', czech: 'Horko', category: 'weather', example: '今天很热。(Dnes je horko.)', strokes: 10 },
    { id: 139, chinese: '冷', pinyin: 'lěng', czech: 'Zima (chladno)', category: 'weather', example: '今天很冷。(Dnes je zima.)', strokes: 7 },
    { id: 140, chinese: '暖和', pinyin: 'nuǎn huo', czech: 'Teplo', category: 'weather', example: '今天很暖和。(Dnes je teplo.)', strokes: 15 },
    
    // Město a budovy (141-155)
    { id: 141, chinese: '学校', pinyin: 'xué xiào', czech: 'Škola', category: 'city', example: '我去学校。(Jdu do školy.)', strokes: 14 },
    { id: 142, chinese: '医院', pinyin: 'yī yuàn', czech: 'Nemocnice', category: 'city', example: '他在医院工作。(Pracuje v nemocnici.)', strokes: 11 },
    { id: 143, chinese: '银行', pinyin: 'yín háng', czech: 'Banka', category: 'city', example: '去银行取钱。(Jít do banky vybrat peníze.)', strokes: 14 },
    { id: 144, chinese: '商店', pinyin: 'shāng diàn', czech: 'Obchod', category: 'city', example: '去商店买东西。(Jít nakupovat do obchodu.)', strokes: 15 },
    { id: 145, chinese: '餐厅', pinyin: 'cān tīng', czech: 'Restaurace', category: 'city', example: '这家餐厅很好吃。(Tato restaurace je výborná.)', strokes: 16 },
    { id: 146, chinese: '公园', pinyin: 'gōng yuán', czech: 'Park', category: 'city', example: '去公园散步。(Jít se projít do parku.)', strokes: 10 },
    { id: 147, chinese: '图书馆', pinyin: 'tú shū guǎn', czech: 'Knihovna', category: 'city', example: '在图书馆看书。(Číst knihu v knihovně.)', strokes: 17 },
    { id: 148, chinese: '电影院', pinyin: 'diàn yǐng yuàn', czech: 'Kino', category: 'city', example: '去看电影。(Jít do kina.)', strokes: 18 },
    { id: 149, chinese: '超市', pinyin: 'chāo shì', czech: 'Supermarket', category: 'city', example: '去超市买菜。(Jít nakoupit do supermarketu.)', strokes: 13 },
    { id: 150, chinese: '邮局', pinyin: 'yóu jú', czech: 'Pošta', category: 'city', example: '去邮局寄信。(Jít poslat dopis na poštu.)', strokes: 12 },
    { id: 151, chinese: '警察局', pinyin: 'jǐng chá jú', czech: 'Policejní stanice', category: 'city', example: '去警察局报案。(Jít nahlásit krádež na policii.)', strokes: 16 },
    { id: 152, chinese: '公司', pinyin: 'gōng sī', czech: 'Firma', category: 'city', example: '他在一家公司工作。(Pracuje ve firmě.)', strokes: 10 },
    { id: 153, chinese: '家', pinyin: 'jiā', czech: 'Dům / Domov', category: 'city', example: '回家 (jít domů)', strokes: 10 },
    { id: 154, chinese: '门', pinyin: 'mén', czech: 'Dveře', category: 'city', example: '关门 (zavřít dveře)', strokes: 8 },
    { id: 155, chinese: '窗', pinyin: 'chuāng', czech: 'Okno', category: 'city', example: '开窗 (otevřít okno)', strokes: 12 },
    
    // Tělo a zdraví (156-170)
    { id: 156, chinese: '头', pinyin: 'tóu', czech: 'Hlava', category: 'body', example: '头痛 (bolest hlavy)', strokes: 9 },
    { id: 157, chinese: '手', pinyin: 'shǒu', czech: 'Ruka', category: 'body', example: '洗手 (umýt si ruce)', strokes: 4 },
    { id: 158, chinese: '脚', pinyin: 'jiǎo', czech: 'Noha', category: 'body', example: '脚疼 (bolest nohy)', strokes: 11 },
    { id: 159, chinese: '眼睛', pinyin: 'yǎn jing', czech: 'Oči', category: 'body', example: '眼睛累了。(Oči jsou unavené.)', strokes: 16 },
    { id: 160, chinese: '耳朵', pinyin: 'ěr duo', czech: 'Uši', category: 'body', example: '耳朵听不见。(Uši neslyší.)', strokes: 11 },
    { id: 161, chinese: '鼻子', pinyin: 'bí zi', czech: 'Nos', category: 'body', example: '鼻子不通。(Nos je ucpaný.)', strokes: 12 },
    { id: 162, chinese: '嘴巴', pinyin: 'zuǐ ba', czech: 'Ústa', category: 'body', example: '嘴巴干。(Ústa jsou suchá.)', strokes: 11 },
    { id: 163, chinese: '牙齿', pinyin: 'yá chǐ', czech: 'Zuby', category: 'body', example: '刷牙 (čistit si zuby)', strokes: 13 },
    { id: 164, chinese: '头发', pinyin: 'tóu fa', czech: 'Vlasy', category: 'body', example: '剪头发 (stříhat vlasy)', strokes: 13 },
    { id: 165, chinese: '身体', pinyin: 'shēn tǐ', czech: 'Tělo', category: 'body', example: '身体健康。(Tělo je zdravé.)', strokes: 15 },
    { id: 166, chinese: '生病', pinyin: 'shēng bìng', czech: 'Být nemocný', category: 'body', example: '他生病了。(On onemocněl.)', strokes: 13 },
    { id: 167, chinese: '药', pinyin: 'yào', czech: 'Lék', category: 'body', example: '吃药 (užívat léky)', strokes: 12 },
    { id: 168, chinese: '医生', pinyin: 'yī sheng', czech: 'Lékař', category: 'body', example: '看医生 (navštívit lékaře)', strokes: 11 },
    { id: 169, chinese: '累', pinyin: 'lèi', czech: 'Unavený', category: 'body', example: '我很累。(Jsem velmi unavený.)', strokes: 11 },
    { id: 170, chinese: '疼', pinyin: 'téng', czech: 'Bolet', category: 'body', example: '头疼。(Bolí mě hlava.)', strokes: 10 },
    
    // Koníčky a volný čas (171-185)
    { id: 171, chinese: '音乐', pinyin: 'yīn yuè', czech: 'Hudba', category: 'hobbies', example: '我喜欢音乐。(Rád poslouchám hudbu.)', strokes: 14 },
    { id: 172, chinese: '电影', pinyin: 'diàn yǐng', czech: 'Film', category: 'hobbies', example: '看电影 (dívat se na film)', strokes: 14 },
    { id: 173, chinese: '书', pinyin: 'shū', czech: 'Kniha', category: 'hobbies', example: '看书 (číst knihu)', strokes: 10 },
    { id: 174, chinese: '运动', pinyin: 'yùn dòng', czech: 'Sport', category: 'hobbies', example: '做运动 (provozovat sport)', strokes: 14 },
    { id: 175, chinese: '游泳', pinyin: 'yóu yǒng', czech: 'Plavání', category: 'hobbies', example: '去游泳 (jít plavat)', strokes: 16 },
    { id: 176, chinese: '跑步', pinyin: 'pǎo bù', czech: 'Běhání', category: 'hobbies', example: '每天跑步 (běhat každý den)', strokes: 12 },
    { id: 177, chinese: '篮球', pinyin: 'lán qiú', czech: 'Basketbal', category: 'hobbies', example: '打篮球 (hrát basketbal)', strokes: 18 },
    { id: 178, chinese: '足球', pinyin: 'zú qiú', czech: 'Fotbal', category: 'hobbies', example: '踢足球 (hrát fotbal)', strokes: 15 },
    { id: 179, chinese: '游戏', pinyin: 'yóu xì', czech: 'Hra', category: 'hobbies', example: '玩游戏 (hrát hry)', strokes: 16 },
    { id: 180, chinese: '旅行', pinyin: 'lǚ xíng', czech: 'Cestování', category: 'hobbies', example: '喜欢旅行 (rád cestuji)', strokes: 16 },
    { id: 181, chinese: '拍照', pinyin: 'pāi zhào', czech: 'Fotografování', category: 'hobbies', example: '拍照留念 (vyfotit se na památku)', strokes: 14 },
    { id: 182, chinese: '唱歌', pinyin: 'chàng gē', czech: 'Zpívání', category: 'hobbies', example: '喜欢唱歌 (rád zpívám)', strokes: 15 },
    { id: 183, chinese: '跳舞', pinyin: 'tiào wǔ', czech: 'Tanec', category: 'hobbies', example: '跳舞很有趣。(Tanec je zábavný.)', strokes: 19 },
    { id: 184, chinese: '画画', pinyin: 'huà huà', czech: 'Malování', category: 'hobbies', example: '喜欢画画 (rád maluji)', strokes: 16 },
    { id: 185, chinese: '做饭', pinyin: 'zuò fàn', czech: 'Vaření', category: 'hobbies', example: '我喜欢做饭。(Rád vařím.)', strokes: 13 },
    
    // Emoce a pocity (186-200)
    { id: 186, chinese: '高兴', pinyin: 'gāo xìng', czech: 'Šťastný', category: 'emotions', example: '我很高兴。(Jsem velmi šťastný.)', strokes: 13 },
    { id: 187, chinese: '难过', pinyin: 'nán guò', czech: 'Smutný', category: 'emotions', example: '他很难过。(On je velmi smutný.)', strokes: 13 },
    { id: 188, chinese: '生气', pinyin: 'shēng qì', czech: 'Naštvaný', category: 'emotions', example: '别生气。(Nezlob se.)', strokes: 13 },
    { id: 189, chinese: '害怕', pinyin: 'hài pà', czech: 'Vystrašený', category: 'emotions', example: '我害怕。(Bojím se.)', strokes: 13 },
    { id: 190, chinese: '紧张', pinyin: 'jǐn zhāng', czech: 'Nervózní', category: 'emotions', example: '考试前很紧张。(Před zkouškou jsem nervózní.)', strokes: 16 },
    { id: 191, chinese: '兴奋', pinyin: 'xīng fèn', czech: 'Nadšený', category: 'emotions', example: '我很兴奋。(Jsem nadšený.)', strokes: 16 },
    { id: 192, chinese: '惊讶', pinyin: 'jīng yà', czech: 'Překvapený', category: 'emotions', example: '他很惊讶。(On je překvapený.)', strokes: 16 },
    { id: 193, chinese: '无聊', pinyin: 'wú liáo', czech: 'Nudný', category: 'emotions', example: '今天很无聊。(Dnes je to nudné.)', strokes: 13 },
    { id: 194, chinese: '有趣', pinyin: 'yǒu qù', czech: 'Zajímavý', category: 'emotions', example: '这本书很有趣。(Tato kniha je zajímavá.)', strokes: 12 },
    { id: 195, chinese: '喜欢', pinyin: 'xǐ huan', czech: 'Mít rád', category: 'emotions', example: '我喜欢你。(Mám tě rád.)', strokes: 13 },
    { id: 196, chinese: '爱', pinyin: 'ài', czech: 'Milovat', category: 'emotions', example: '我爱你。(Miluji tě.)', strokes: 10 },
    { id: 197, chinese: '希望', pinyin: 'xī wàng', czech: 'Doufat', category: 'emotions', example: '我希望如此。(Doufám, že ano.)', strokes: 15 },
    { id: 198, chinese: '担心', pinyin: 'dān xīn', czech: 'Obávat se', category: 'emotions', example: '别担心。(Neboj se.)', strokes: 12 },
    { id: 199, chinese: '满意', pinyin: 'mǎn yì', czech: 'Spokojený', category: 'emotions', example: '我很满意。(Jsem velmi spokojený.)', strokes: 16 },
    { id: 200, chinese: '失望', pinyin: 'shī wàng', czech: 'Zklamaný', category: 'emotions', example: '他很失望。(On je zklamaný.)', strokes: 14 }
];

// Úspěchy
const achievements = [
    { id: 'first_word', title: 'První krůčky', desc: 'Naučil ses první slovíčko!', icon: '🌱', requirement: 1 },
    { id: 'ten_words', title: 'Slovíček deset', desc: 'Naučil ses 10 slovíček!', icon: '📚', requirement: 10 },
    { id: 'twenty_five_words', title: 'Pilný student', desc: 'Naučil ses 25 slovíček!', icon: '🎓', requirement: 25 },
    { id: 'fifty_words', title: 'Slovní zásoba', desc: 'Naučil ses 50 slovíček!', icon: '📖', requirement: 50 },
    { id: 'hundred_words', title: 'Pokročilý', desc: 'Naučil ses 100 slovíček!', icon: '🌟', requirement: 100 },
    { id: 'all_words', title: 'Mistr slovíček', desc: 'Naučil ses všechna slovíčka!', icon: '🏆', requirement: 200 },
    { id: 'first_quiz', title: 'Kvízový začátečník', desc: 'Absolvoval jsi první kvíz!', icon: '📝', requirement: 1 },
    { id: 'perfect_quiz', title: 'Perfektní skóre', desc: 'Získal jsi 100% v kvízu!', icon: '💯', requirement: 1 },
    { id: 'five_quizzes', title: 'Kvízový mistr', desc: 'Absolvoval jsi 5 kvízů!', icon: '🎯', requirement: 5 },
    { id: 'five_day_streak', title: 'Týdenní bojovník', desc: '5 dní učení v řadě!', icon: '🔥', requirement: 5 },
    { id: 'ten_day_streak', title: 'Nezlomný', desc: '10 dní učení v řadě!', icon: '⚡', requirement: 10 },
    { id: 'thirty_day_streak', title: 'Legendární', desc: '30 dní učení v řadě!', icon: '👑', requirement: 30 },
    { id: 'first_writing', title: 'První znaky', desc: 'Napsal jsi svůj první znak!', icon: '✍️', requirement: 1 },
    { id: 'tone_master', title: 'Mistr tónů', desc: 'Zvládl jsi všechny 4 tóny!', icon: '🎵', requirement: 4 },
    { id: 'grammar_beginner', title: 'Gramatický začátečník', desc: 'Dokonči první gramatickou lekci!', icon: '📐', requirement: 1 },
    { id: 'grammar_intermediate', title: 'Gramatický pokročilý', desc: 'Dokonči 5 gramatických lekcí!', icon: '📊', requirement: 5 },
    { id: 'phrase_collector', title: 'Sběratel frází', desc: 'Nauč se 20 frází!', icon: '💬', requirement: 20 },
    { id: 'sentence_builder', title: 'Stavitel vět', desc: 'Vytvoř 10 správných vět!', icon: '🏗️', requirement: 10 },
    { id: 'level_5', title: 'Úroveň 5', desc: 'Dosáhni úrovně 5!', icon: '⭐', requirement: 5 },
    { id: 'level_10', title: 'Úroveň 10', desc: 'Dosáhni úrovně 10!', icon: '🌟', requirement: 10 },
    { id: 'level_20', title: 'Úroveň 20', desc: 'Dosáhni úrovně 20!', icon: '✨', requirement: 20 }
];

// Gramatické lekce - Rozšířená sekce
const grammarLessons = [
    // Základní gramatika (úroveň HSK 1)
    {
        id: 'grammar_1',
        title: 'Základní větná struktura',
        level: 1,
        category: 'basics',
        explanation: 'Čínská věta má základní strukturu: PODMĚT + PŘÍSUDEK + PŘEDMĚT. Na rozdíl od češtiny se v čínštině nemění slovosled pro otázky.',
        examples: [
            { chinese: '我是学生。', pinyin: 'Wǒ shì xuésheng.', czech: 'Jsem student.' },
            { chinese: '你喜欢茶。', pinyin: 'Nǐ xǐhuan chá.', czech: 'Máš rád čaj.' },
            { chinese: '他喝水。', pinyin: 'Tā hē shuǐ.', czech: 'On pije vodu.' }
        ],
        exercises: [
            { type: 'translate', question: 'Přelož: Jsem Čech.', answer: '我是捷克人。', hint: 'Já + být + Čech' },
            { type: 'order', question: 'Seřaď slova: 喜欢 / 我 / 咖啡', answer: '我喜欢咖啡。', hint: 'Podmět + přísudek + předmět' }
        ]
    },
    {
        id: 'grammar_2',
        title: 'Zápor "不" (bù)',
        level: 1,
        category: 'basics',
        explanation: 'Zápor "不" se umisťuje před sloveso nebo přídavné jméno. Výjimkou je "是" (být), které se v záporu mění na "不是".',
        examples: [
            { chinese: '我不是老师。', pinyin: 'Wǒ bú shì lǎoshī.', czech: 'Nejsem učitel.' },
            { chinese: '我不喝茶。', pinyin: 'Wǒ bù hē chá.', czech: 'Nepiji čaj.' },
            { chinese: '今天不冷。', pinyin: 'Jīntiān bù lěng.', czech: 'Dnes není zima.' }
        ],
        exercises: [
            { type: 'translate', question: 'Přelož: Nejsem unavený.', answer: '我不累。', hint: 'Já + ne + unavený' },
            { type: 'fill', question: 'Doplň zápor: 他 ___ 高兴。(On není šťastný.)', answer: '不', hint: 'Zápor před přídavným jménem' }
        ]
    },
    {
        id: 'grammar_3',
        title: 'Tázací částice "吗" (ma)',
        level: 1,
        category: 'questions',
        explanation: 'Pro vytvoření ano/ne otázky přidejte částici "吗" na konec oznamovací věty. Slovosled se nemění.',
        examples: [
            { chinese: '你好吗？', pinyin: 'Nǐ hǎo ma?', czech: 'Jak se máš? (Dosl: Ty dobrý?)' },
            { chinese: '你是学生吗？', pinyin: 'Nǐ shì xuésheng ma?', czech: 'Jsi student?' },
            { chinese: '你喜欢咖啡吗？', pinyin: 'Nǐ xǐhuan kāfēi ma?', czech: 'Máš rád kávu?' }
        ],
        exercises: [
            { type: 'translate', question: 'Vytvoř otázku: Máš rád čaj?', answer: '你喜欢茶吗？', hint: 'Ty + mít rád + čaj +吗' },
            { type: 'transform', question: 'Změň na otázku: 他是医生。(On je lékař.)', answer: '他是医生吗？', hint: 'Přidej 吗 na konec' }
        ]
    },
    {
        id: 'grammar_4',
        title: 'Přivlastňovací částice "的" (de)',
        level: 1,
        category: 'particles',
        explanation: 'Částice "的" se používá k vyjádření přivlastnění. Struktura: MAJITEL + 的 + VĚC.',
        examples: [
            { chinese: '我的书', pinyin: 'Wǒ de shū', czech: 'Moje kniha' },
            { chinese: '你的车', pinyin: 'Nǐ de chē', czech: 'Tvoje auto' },
            { chinese: '他的家', pinyin: 'Tā de jiā', czech: 'Jeho dům' }
        ],
        exercises: [
            { type: 'translate', question: 'Přelož: Moje rodina', answer: '我的家庭', hint: 'Já + 的 + rodina' },
            { type: 'fill', question: 'Doplň: 你 ___ 朋友 (tvůj přítel)', answer: '的', hint: 'Přivlastňovací částice' }
        ]
    },
    {
        id: 'grammar_5',
        title: 'Otázka "什么" (shénme) - Co/Jaký',
        level: 1,
        category: 'questions',
        explanation: '"什么" znamená "co" nebo "jaký". Používá se k tvorbě speciálních otázek.',
        examples: [
            { chinese: '这是什么？', pinyin: 'Zhè shì shénme?', czech: 'Co je to?' },
            { chinese: '你叫什么名字？', pinyin: 'Nǐ jiào shénme míngzi?', czech: 'Jak se jmenuješ?' },
            { chinese: '你想吃什么？', pinyin: 'Nǐ xiǎng chī shénme?', czech: 'Co chceš jíst?' }
        ],
        exercises: [
            { type: 'translate', question: 'Přelož: Co chceš dělat?', answer: '你想做什么？', hint: 'Ty + chtít + dělat + co' },
            { type: 'match', question: 'Spáruj: 什么 s významem', answer: 'co/jaký', hint: 'Tázací zájmeno' }
        ]
    },
    {
        id: 'grammar_6',
        title: 'Číslovky a klasifikátory',
        level: 2,
        category: 'numbers',
        explanation: 'V čínštině se mezi číslovkou a podstatným jménem vždy používá klasifikátor. Nejčastější je "个" (gè).',
        examples: [
            { chinese: '一个人', pinyin: 'Yī gè rén', czech: 'Jeden člověk' },
            { chinese: '三本书', pinyin: 'Sān běn shū', czech: 'Tři knihy' },
            { chinese: '两杯水', pinyin: 'Liǎng bēi shuǐ', czech: 'Dvě sklenice vody' }
        ],
        exercises: [
            { type: 'translate', question: 'Přelož: Tři lidé', answer: '三个人', hint: 'Tři + 个 + lidé' },
            { type: 'fill', question: 'Doplň klasifikátor: 一 ___ 书 (jedna kniha)', answer: '本', hint: 'Klasifikátor pro knihy' }
        ]
    },
    {
        id: 'grammar_7',
        title: 'Budoucí čas s "会" (huì)',
        level: 2,
        category: 'tenses',
        explanation: '"会" vyjadřuje budoucnost nebo schopnost. Struktura: Podmět + 会 + sloveso.',
        examples: [
            { chinese: '我会说中文。', pinyin: 'Wǒ huì shuō Zhōngwén.', czech: 'Umím mluvit čínsky.' },
            { chinese: '明天会下雨。', pinyin: 'Míngtiān huì xià yǔ.', czech: 'Zítra bude pršet.' },
            { chinese: '他会来吗？', pinyin: 'Tā huì lái ma?', czech: 'Přijde?' }
        ],
        exercises: [
            { type: 'translate', question: 'Přelož: Budu studovat.', answer: '我会学习。', hint: 'Já + 会 + studovat' },
            { type: 'transform', question: 'Změň na budoucí čas: 我去北京。(Jdu do Pekingu.)', answer: '我会去北京。', hint: 'Přidej 会 před sloveso' }
        ]
    },
    {
        id: 'grammar_8',
        title: 'Minulý čas s "了" (le)',
        level: 2,
        category: 'tenses',
        explanation: '"了" označuje dokončenou akci. Umisťuje se za sloveso nebo na konec věty.',
        examples: [
            { chinese: '我吃饭了。', pinyin: 'Wǒ chī fàn le.', czech: 'Snědl jsem.' },
            { chinese: '他去了学校。', pinyin: 'Tā qù le xuéxiào.', czech: 'Šel do školy.' },
            { chinese: '我买了三本书。', pinyin: 'Wǒ mǎi le sān běn shū.', czech: 'Koupil jsem tři knihy.' }
        ],
        exercises: [
            { type: 'translate', question: 'Přelož: Koupil jsem auto.', answer: '我买车了。', hint: 'Já + koupit + auto +了' },
            { type: 'fill', question: 'Doplň 了: 他吃 ___ 饭。(On snědl jídlo.)', answer: '了', hint: 'Dokončená akce' }
        ]
    },
    {
        id: 'grammar_9',
        title: 'Porovnání s "比" (bǐ)',
        level: 2,
        category: 'comparison',
        explanation: 'Struktura pro porovnání: A + 比 + B + přídavné jméno. Vyjadřuje "A je [příd.jm.] než B".',
        examples: [
            { chinese: '我比你高。', pinyin: 'Wǒ bǐ nǐ gāo.', czech: 'Jsem vyšší než ty.' },
            { chinese: '今天比昨天热。', pinyin: 'Jīntiān bǐ zuótiān rè.', czech: 'Dnes je tepleji než včera.' },
            { chinese: '这个比那个好。', pinyin: 'Zhège bǐ nàge hǎo.', czech: 'Tento je lepší než tamten.' }
        ],
        exercises: [
            { type: 'translate', question: 'Přelož: On je silnější než já.', answer: '他比我强。', hint: 'On + 比 + já + silný' },
            { type: 'order', question: 'Seřaď: 比 / 我 / 大 / 他', answer: '他比我大。', hint: 'On + 比 + já + starší' }
        ]
    },
    {
        id: 'grammar_10',
        title: 'Modální slovesa: 想，要，能',
        level: 2,
        category: 'modals',
        explanation: '想 (chtít/myslet), 要 (chtít/muset), 能 (moci/umět). Umisťují se před hlavní sloveso.',
        examples: [
            { chinese: '我想学习中文。', pinyin: 'Wǒ xiǎng xuéxí Zhōngwén.', czech: 'Chci se učit čínsky.' },
            { chinese: '我要回家。', pinyin: 'Wǒ yào huí jiā.', czech: 'Chci jít domů.' },
            { chinese: '我能帮助你。', pinyin: 'Wǒ néng bāngzhù nǐ.', czech: 'Mohu ti pomoci.' }
        ],
        exercises: [
            { type: 'translate', question: 'Přelož: Chci pít vodu.', answer: '我想喝水。', hint: 'Já + 想 + pít + voda' },
            { type: 'choose', question: 'Vyber správné sloveso: ___ 去中国 (Chtít jet do Číny)', answer: '想', hint: 'Vyjádření touhy' }
        ]
    },
    {
        id: 'grammar_11',
        title: 'Místa a směry: 在，从，到',
        level: 3,
        category: 'prepositions',
        explanation: '在 (v/na), 从 (od/z), 到 (do). Tyto předložky určují místo a směr.',
        examples: [
            { chinese: '我在家。', pinyin: 'Wǒ zài jiā.', czech: 'Jsem doma.' },
            { chinese: '我从北京来。', pinyin: 'Wǒ cóng Běijīng lái.', czech: 'Pocházím z Pekingu.' },
            { chinese: '他到学校去。', pinyin: 'Tā dào xuéxiào qù.', czech: 'Jde do školy.' }
        ],
        exercises: [
            { type: 'translate', question: 'Přelož: Jsem v restauraci.', answer: '我在餐厅。', hint: 'Já + 在 + restaurace' },
            { type: 'fill', question: 'Doplň: 他来 ___ 美国。(On pochází z Ameriky.)', answer: '从', hint: 'Předložka původu' }
        ]
    },
    {
        id: 'grammar_12',
        title: 'Časové výrazy',
        level: 3,
        category: 'time',
        explanation: 'Časové výrazy se obvykle umisťují na začátek věty nebo hned za podmět.',
        examples: [
            { chinese: '我今天很忙。', pinyin: 'Wǒ jīntiān hěn máng.', czech: 'Dnes mám hodně práce.' },
            { chinese: '明天我们去公园。', pinyin: 'Míngtiān wǒmen qù gōngyuán.', czech: 'Zítra půjdeme do parku.' },
            { chinese: '他每天早上跑步。', pinyin: 'Tā měitiān zǎoshang pǎobù.', czech: 'Každé ráno běhá.' }
        ],
        exercises: [
            { type: 'translate', question: 'Přelož: Zítra budu studovat.', answer: '明天我会学习。', hint: 'Zítra + já + 会 + studovat' },
            { type: 'order', question: 'Seřaď: 早上 / 他 / 六点 / 起床', answer: '他早上六点起床。', hint: 'Podmět + čas + sloveso' }
        ]
    },
    {
        id: 'grammar_13',
        title: 'Opakování s "也" (yě)',
        level: 1,
        category: 'adverbs',
        explanation: '"也" znamená "také" a umisťuje se před sloveso nebo přídavné jméno.',
        examples: [
            { chinese: '我也是。', pinyin: 'Wǒ yě shì.', czech: 'Já také.' },
            { chinese: '他也喜欢茶。', pinyin: 'Tā yě xǐhuan chá.', czech: 'On také má rád čaj.' },
            { chinese: '今天也很热。', pinyin: 'Jīntiān yě hěn rè.', czech: 'Dnes je také horko.' }
        ],
        exercises: [
            { type: 'translate', question: 'Přelož: Já také chci jít.', answer: '我也想去。', hint: 'Já + 也 + chtít + jít' },
            { type: 'fill', question: 'Doplň: 他 ___ 是学生。(On je také student.)', answer: '也', hint: 'Také před slovesem' }
        ]
    },
    {
        id: 'grammar_14',
        title: 'Stupeňování s "很" (hěn)',
        level: 1,
        category: 'adverbs',
        explanation: '"很" znamená "velmi". V čínštině se často používá i když není nutné zdůraznit stupeň.',
        examples: [
            { chinese: '很好', pinyin: 'hěn hǎo', czech: 'velmi dobré / dobré' },
            { chinese: '很高兴', pinyin: 'hěn gāoxìng', czech: 'velmi šťastný' },
            { chinese: '很冷', pinyin: 'hěn lěng', czech: 'velmi zima' }
        ],
        exercises: [
            { type: 'translate', question: 'Přelož: Velmi dobrý', answer: '很好', hint: '很 + dobrý' },
            { type: 'fill', question: 'Doplň: 今天 ___ 热。(Dnes je velmi horko.)', answer: '很', hint: 'Stupňující příslovce' }
        ]
    },
    {
        id: 'grammar_15',
        title: 'Rozkazovací způsob',
        level: 2,
        category: 'imperative',
        explanation: 'Rozkazovací způsob se tvoří prostým slovesem, často s 请 (prosím) pro zdvořilost.',
        examples: [
            { chinese: '请坐。', pinyin: 'Qǐng zuò.', czech: 'Prosím, sedněte si.' },
            { chinese: '进来！', pinyin: 'Jìnlái!', czech: 'Pojď dál!' },
            { chinese: '别说话。', pinyin: 'Bié shuōhuà.', czech: 'Nemluv.' }
        ],
        exercises: [
            { type: 'translate', question: 'Přelož: Prosím, pojď sem.', answer: '请来这里。', hint: '请 + přijít + sem' },
            { type: 'transform', question: 'Vytvoř zdvořilý rozkaz: 喝 (pít)', answer: '请喝', hint: 'Přidej 请 před sloveso' }
        ]
    }
];

// Fráze a užitečné věty - Rozšířená sekce
const phrases = [
    // Základní fráze
    { id: 'p1', chinese: '你好，很高兴认识你。', pinyin: 'Nǐ hǎo, hěn gāoxìng rènshi nǐ.', czech: 'Ahoj, rád tě poznávám.', category: 'basics', situation: 'Setkání' },
    { id: 'p2', chinese: '请问，厕所在哪里？', pinyin: 'Qǐngwèn, cèsuǒ zài nǎlǐ?', czech: 'Promiňte, kde jsou záchody?', category: 'travel', situation: 'Orientace' },
    { id: 'p3', chinese: '我不太明白。', pinyin: 'Wǒ bú tài míngbai.', czech: 'Nerozumím úplně.', category: 'basics', situation: 'Komunikace' },
    { id: 'p4', chinese: '你会说英语吗？', pinyin: 'Nǐ huì shuō Yīngyǔ ma?', czech: 'Mluvíš anglicky?', category: 'basics', situation: 'Komunikace' },
    { id: 'p5', chinese: '请再说一遍。', pinyin: 'Qǐng zài shuō yí biàn.', czech: 'Řekněte to prosím ještě jednou.', category: 'basics', situation: 'Komunikace' },
    { id: 'p6', chinese: '这个多少钱？', pinyin: 'Zhège duōshao qián?', czech: 'Kolik to stojí?', category: 'shopping', situation: 'Nakupování' },
    { id: 'p7', chinese: '太贵了，便宜一点吧。', pinyin: 'Tài guì le, piányi yìdiǎn ba.', czech: 'Je to příliš drahé, může to být levnější?', category: 'shopping', situation: 'Smlouvání' },
    { id: 'p8', chinese: '我要这个。', pinyin: 'Wǒ yào zhège.', czech: 'Chci toto.', category: 'shopping', situation: 'Nakupování' },
    { id: 'p9', chinese: '有菜单吗？', pinyin: 'Yǒu càidān ma?', czech: 'Máte jídelní lístek?', category: 'food', situation: 'Restaurace' },
    { id: 'p10', chinese: '买单！', pinyin: 'Mǎidān!', czech: 'Účet, prosím!', category: 'food', situation: 'Restaurace' },
    { id: 'p11', chinese: '很好吃！', pinyin: 'Hěn hǎochī!', czech: 'Je to velmi chutné!', category: 'food', situation: 'Restaurace' },
    { id: 'p12', chinese: '我对这个过敏。', pinyin: 'Wǒ duì zhège guòmǐn.', czech: 'Jsem alergický na toto.', category: 'food', situation: 'Restaurace' },
    { id: 'p13', chinese: '请帮我一下。', pinyin: 'Qǐng bāng wǒ yíxià.', czech: 'Pomozte mi prosím.', category: 'basics', situation: 'Žádost o pomoc' },
    { id: 'p14', chinese: '对不起，我迷路了。', pinyin: 'Duìbuqǐ, wǒ mílù le.', czech: 'Promiňte, zabloudil jsem.', category: 'travel', situation: 'Ztracen' },
    { id: 'p15', chinese: '附近有银行吗？', pinyin: 'Fùjìn yǒu yínháng ma?', czech: 'Je poblíž banka?', category: 'travel', situation: 'Orientace' },
    { id: 'p16', chinese: '怎么去火车站？', pinyin: 'Zěnme qù huǒchē zhàn?', czech: 'Jak se dostanu na nádraží?', category: 'travel', situation: 'Doprava' },
    { id: 'p17', chinese: '我需要出租车。', pinyin: 'Wǒ xūyào chūzūchē.', czech: 'Potřebuji taxi.', category: 'travel', situation: 'Doprava' },
    { id: 'p18', chinese: '请开慢一点。', pinyin: 'Qǐng kāi màn yìdiǎn.', czech: 'Jeďte pomaleji, prosím.', category: 'travel', situation: 'Taxi' },
    { id: 'p19', chinese: '我有 reservation。', pinyin: 'Wǒ yǒu reservation.', czech: 'Mám rezervaci.', category: 'travel', situation: 'Hotel' },
    { id: 'p20', chinese: '房间里有 WiFi 吗？', pinyin: 'Fángjiān lǐ yǒu WiFi ma?', czech: 'Je na pokoji WiFi?', category: 'travel', situation: 'Hotel' },
    { id: 'p21', chinese: '早上好，睡得好吗？', pinyin: 'Zǎoshang hǎo, shuì de hǎo ma?', czech: 'Dobré ráno, spal jste dobře?', category: 'greetings', situation: 'Ranní pozdrav' },
    { id: 'p22', chinese: '祝你旅途愉快！', pinyin: 'Zhù nǐ lǚtú yúkuài!', czech: 'Přeji ti šťastnou cestu!', category: 'greetings', situation: 'Rozloučení' },
    { id: 'p23', chinese: '保持联系！', pinyin: 'Bǎochí liánxì!', czech: 'Zůstaňme v kontaktu!', category: 'greetings', situation: 'Rozloučení' },
    { id: 'p24', chinese: '欢迎来做客！', pinyin: 'Huānyíng lái zuòkè!', czech: 'Zvi nás návštěvou!', category: 'greetings', situation: 'Pozvání' },
    { id: 'p25', chinese: '生日快乐！', pinyin: 'Shēngrì kuàilè!', czech: 'Všechno nejlepší k narozeninám!', category: 'celebrations', situation: 'Oslava' },
    { id: 'p26', chinese: '新年快乐！', pinyin: 'Xīnnián kuàilè!', czech: 'Šťastný nový rok!', category: 'celebrations', situation: 'Svátky' },
    { id: 'p27', chinese: '恭喜发财！', pinyin: 'Gōngxǐ fācái!', czech: 'Přeji bohatství! (čínský novoroční pozdrav)', category: 'celebrations', situation: 'Čínský Nový rok' },
    { id: 'p28', chinese: '身体怎么样？', pinyin: 'Shēntǐ zěnmeyàng?', czech: 'Jak je na tom zdraví?', category: 'health', situation: 'Zdraví' },
    { id: 'p29', chinese: '多保重！', pinyin: 'Duō bǎozhòng!', czech: 'Opatruj se!', category: 'health', situation: 'Starost' },
    { id: 'p30', chinese: '祝你早日康复！', pinyin: 'Zhù nǐ zǎorì kāngfù!', czech: 'Přeji brzké uzdravení!', category: 'health', situation: 'Nemoc' },
    
    // Pokročilé fráze pro konverzaci
    { id: 'p31', chinese: '我觉得你说得对。', pinyin: 'Wǒ juéde nǐ shuō de duì.', czech: 'Myslím, že máš pravdu.', category: 'conversation', situation: 'Souhlas' },
    { id: 'p32', chinese: '我不太确定。', pinyin: 'Wǒ bú tài quèdìng.', czech: 'Nejsem si úplně jistý.', category: 'conversation', situation: 'Nejistota' },
    { id: 'p33', chinese: '你怎么看？', pinyin: 'Nǐ zěnme kàn?', czech: 'Co si o tom myslíš?', category: 'conversation', situation: 'Názor' },
    { id: 'p34', chinese: '让我想一想。', pinyin: 'Ràng wǒ xiǎng yì xiǎng.', czech: 'Nech mě to promyslet.', category: 'conversation', situation: 'Přemýšlení' },
    { id: 'p35', chinese: '没问题！', pinyin: 'Méi wèntí!', czech: 'Žádný problém!', category: 'conversation', situation: 'Souhlas' },
    { id: 'p36', chinese: '当然可以。', pinyin: 'Dāngrán kěyǐ.', czech: 'Samozřejmě.', category: 'conversation', situation: 'Souhlas' },
    { id: 'p37', chinese: '不好意思，打扰一下。', pinyin: 'Bù hǎoyìsi, dǎrǎo yíxià.', czech: 'Omlouvám se, vyrušuji.', category: 'politeness', situation: 'Vyrušení' },
    { id: 'p38', chinese: '非常感谢你的帮助！', pinyin: 'Fēicháng gǎnxiè nǐ de bāngzhù!', czech: 'Děkuji mockrát za tvou pomoc!', category: 'politeness', situation: 'Poděkování' },
    { id: 'p39', chinese: '别客气。', pinyin: 'Bié kèqi.', czech: 'Není zač.', category: 'politeness', situation: 'Reakce na dík' },
    { id: 'p40', chinese: '希望你玩得开心！', pinyin: 'Xīwàng nǐ wán de kāixīn!', czech: 'Doufám, že se budeš bavit!', category: 'wishes', situation: 'Přání' }
];

// Věty pro překladové cvičení
const sentences = [
    { id: 's1', czech: 'Jsem student a učím se čínsky.', chinese: '我是学生，我在学中文。', pinyin: 'Wǒ shì xuésheng, wǒ zài xué Zhōngwén.', level: 1 },
    { id: 's2', czech: 'Mám rád čaj, ale nepiji kávu.', chinese: '我喜欢茶，但是不喝咖啡。', pinyin: 'Wǒ xǐhuan chá, dànshì bù hē kāfēi.', level: 1 },
    { id: 's3', czech: 'Kde je nejbližší metro?', chinese: '最近的地铁站在哪里？', pinyin: 'Zuìjìn de dìtiě zhàn zài nǎlǐ?', level: 2 },
    { id: 's4', czech: 'Chtěl bych rezervovat pokoj na dvě noci.', chinese: '我想预订一个房间，住两晚。', pinyin: 'Wǒ xiǎng yùdìng yí gè fángjiān, zhù liǎng wǎn.', level: 2 },
    { id: 's5', czech: 'Toto jídlo je příliš pálivé.', chinese: '这个菜太辣了。', pinyin: 'Zhège cài tài là le.', level: 1 },
    { id: 's6', czech: 'Můj bratr pracuje ve velké firmě.', chinese: '我哥哥在一家大公司工作。', pinyin: 'Wǒ gēge zài yì jiā dà gōngsī gōngzuò.', level: 2 },
    { id: 's7', czech: 'Včera jsem šel do kina s přáteli.', chinese: '昨天我和朋友去看电影了。', pinyin: 'Zuótiān wǒ hé péngyou qù kàn diànyǐng le.', level: 2 },
    { id: 's8', czech: 'Plánuji cestu do Číny příští rok.', chinese: '我计划明年去中国旅行。', pinyin: 'Wǒ jìhuà míngnián qù Zhōngguó lǚxíng.', level: 3 },
    { id: 's9', czech: 'Užím se čínsky tři měsíce.', chinese: '我学中文三个月了。', pinyin: 'Wǒ xué Zhōngwén sān gè yuè le.', level: 2 },
    { id: 's10', czech: 'Můžeš mi pomoct s domácím úkolem?', chinese: '你能帮我做作业吗？', pinyin: 'Nǐ néng bāng wǒ zuò zuòyè ma?', level: 2 },
    { id: 's11', czech: 'Dnes je krásné počasí, že?', chinese: '今天天气很好，对吧？', pinyin: 'Jīntiān tiānqì hěn hǎo, duì ba?', level: 1 },
    { id: 's12', czech: 'Nemohu najít své klíče.', chinese: '我找不到我的钥匙。', pinyin: 'Wǒ zhǎo bú dào wǒ de yàoshi.', level: 2 },
    { id: 's13', czech: 'Byl jsem v Praze dvakrát.', chinese: '我去过布拉格两次。', pinyin: 'Wǒ qù guo Bùlāgé liǎng cì.', level: 3 },
    { id: 's14', czech: 'Čím déle se učím, tím více se mi to líbí.', chinese: '我越学越喜欢。', pinyin: 'Wǒ yuè xué yuè xǐhuan.', level: 3 },
    { id: 's15', czech: 'Musím si koupit nový telefon.', chinese: '我需要买一个新手机。', pinyin: 'Wǒ xūyào mǎi yí gè xīn shǒujī.', level: 2 },
    { id: 's16', czech: 'Ona umí velmi dobře vařit.', chinese: '她很会做饭。', pinyin: 'Tā hěn huì zuò fàn.', level: 2 },
    { id: 's17', czech: 'Počkej chvíli, hned přijdu.', chinese: '等一下，我马上来。', pinyin: 'Děng yíxià, wǒ mǎshàng lái.', level: 1 },
    { id: 's18', czech: 'Nevím, jestli zítra přijde.', chinese: '我不知道他明天会不会来。', pinyin: 'Wǒ bù zhīdào tā míngtiān huì bú huì lái.', level: 3 },
    { id: 's19', czech: 'Tato kniha je zajímavější než ta předešlá.', chinese: '这本书比那本有意思。', pinyin: 'Zhè běn shū bǐ nà běn yǒu yìsi.', level: 3 },
    { id: 's20', czech: 'Doufám, že se brzy uvidíme.', chinese: '希望我们很快能见面。', pinyin: 'Xīwàng wǒmen hěn kuài néng jiànmiàn.', level: 2 }
];

// Tóny a jejich vizualizace
const tones = {
    1: { name: '1. tón', desc: 'Vysoký a rovný', path: 'M 10,30 L 90,30', example: '妈 (mā)' },
    2: { name: '2. tón', desc: 'Stoupavý', path: 'M 10,50 Q 50,50 90,10', example: '麻 (má)' },
    3: { name: '3. tón', desc: 'Klesavě-stoupavý', path: 'M 10,40 Q 30,50 50,45 Q 70,40 90,20', example: '马 (mǎ)' },
    4: { name: '4. tón', desc: 'Klesavý', path: 'M 10,10 Q 50,30 90,50', example: '骂 (mà)' }
};

// ==================== STATE MANAGEMENT ====================

let appState = {
    xp: 0,
    gems: 0,
    streak: 0,
    level: 1,
    wordsLearned: [],
    lessonsCompleted: 0,
    perfectScores: 0,
    dailyProgress: 0,
    lastLogin: null,
    achievements: [],
    writingPractice: [],
    pronunciationPractice: [],
    settings: {
        dailyGoal: 5,
        soundEffects: true
    }
};

// Načtení uloženého stavu
function loadState() {
    const saved = localStorage.getItem('cestinaCinstinaState');
    if (saved) {
        appState = { ...appState, ...JSON.parse(saved) };
        
        // Kontrola denního loginu pro streak
        checkDailyStreak();
    }
    updateUI();
}

// Uložení stavu
function saveState() {
    localStorage.setItem('cestinaCinstinaState', JSON.stringify(appState));
}

// Kontrola denního streaku
function checkDailyStreak() {
    const today = new Date().toDateString();
    if (appState.lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (appState.lastLogin === yesterday.toDateString()) {
            // Pokračující streak
            appState.streak++;
        } else if (appState.lastLogin !== today) {
            // Přerušený streak (pokud nebyl přihlášen včera)
            if (appState.lastLogin) {
                appState.streak = 1;
            } else {
                appState.streak = 1;
            }
        }
        appState.lastLogin = today;
        appState.dailyProgress = 0;
        saveState();
        checkAchievements();
    }
}

// ==================== UI UPDATES ====================

function updateUI() {
    // Update statistik v headeru
    document.getElementById('streak').textContent = appState.streak;
    document.getElementById('xp').textContent = appState.xp;
    document.getElementById('gems').textContent = appState.gems;
    
    // Update profilu
    document.getElementById('user-level').textContent = appState.level;
    document.getElementById('total-xp').textContent = appState.xp;
    document.getElementById('words-learned').textContent = appState.wordsLearned.length;
    document.getElementById('lessons-completed').textContent = appState.lessonsCompleted;
    document.getElementById('perfect-scores').textContent = appState.perfectScores;
    
    // Update denního progressu
    const progressPercent = (appState.dailyProgress / appState.settings.dailyGoal) * 100;
    document.getElementById('daily-progress').style.width = Math.min(progressPercent, 100) + '%';
    document.getElementById('daily-count').textContent = `${appState.dailyProgress}/${appState.settings.dailyGoal} lekcí dokončeno`;
    
    // Update nastavení
    document.getElementById('daily-goal').value = appState.settings.dailyGoal;
    document.getElementById('sound-effects').checked = appState.settings.soundEffects;
    
    // Render achievementů
    renderAchievements();
    
    // Render slovíček
    renderVocabularyGrid();
    
    // Update selectu pro psaní
    updateWritingSelect();
}

// ==================== TAB NAVIGATION ====================

function switchTab(tabName) {
    // Odznačit všechny taby
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Skrýt všechny obsahy
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Aktivovat vybraný tab
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // Reset flashcard při přepnutí
    if (tabName === 'vocabulary') {
        currentCardIndex = 0;
        updateFlashcard();
    }
}

// Event listenery pro navigaci
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        switchTab(tab.dataset.tab);
    });
});

// ==================== VOCABULARY SYSTEM ====================

let currentCardIndex = 0;
let filteredVocabulary = [...vocabulary];

function renderVocabularyGrid(category = 'all') {
    const grid = document.getElementById('vocab-grid');
    
    if (category !== 'all') {
        filteredVocabulary = vocabulary.filter(v => v.category === category);
    } else {
        filteredVocabulary = [...vocabulary];
    }
    
    grid.innerHTML = filteredVocabulary.map(word => `
        <div class="vocab-item" onclick="showWordDetail(${word.id})">
            <div class="chinese">${word.chinese}</div>
            <div class="pinyin">${word.pinyin}</div>
            <div class="meaning">${word.czech}</div>
        </div>
    `).join('');
}

// Filter změna
document.getElementById('vocab-category').addEventListener('change', (e) => {
    renderVocabularyGrid(e.target.value);
});

function showWordDetail(id) {
    const word = vocabulary.find(v => v.id === id);
    currentCardIndex = filteredVocabulary.findIndex(v => v.id === id);
    updateFlashcard();
}

function updateFlashcard() {
    if (filteredVocabulary.length === 0) return;
    
    const word = filteredVocabulary[currentCardIndex];
    document.getElementById('fc-character').textContent = word.chinese;
    document.getElementById('fc-pinyin').textContent = word.pinyin;
    document.getElementById('fc-meaning').textContent = word.czech;
    document.getElementById('fc-example').textContent = word.example;
    
    // Reset flip
    document.getElementById('current-flashcard').classList.remove('flipped');
}

function toggleFlashcard() {
    document.getElementById('current-flashcard').classList.toggle('flipped');
}

function nextCard() {
    currentCardIndex = (currentCardIndex + 1) % filteredVocabulary.length;
    updateFlashcard();
}

function prevCard() {
    currentCardIndex = (currentCardIndex - 1 + filteredVocabulary.length) % filteredVocabulary.length;
    updateFlashcard();
}

// Klávesové zkratky pro flashcards
document.addEventListener('keydown', (e) => {
    if (document.getElementById('vocabulary').classList.contains('active')) {
        if (e.key === 'ArrowRight') nextCard();
        if (e.key === 'ArrowLeft') prevCard();
        if (e.key === ' ' || e.key === 'Enter') toggleFlashcard();
    }
});

// ==================== QUIZ SYSTEM ====================

let quizState = {
    isActive: false,
    score: 0,
    totalQuestions: 0,
    currentQuestion: 0,
    questions: [],
    timer: null,
    timeElapsed: 0
};

function startQuickQuiz() {
    startVocabQuiz('recognition');
}

function startVocabQuiz(type = 'recognition') {
    quizState.isActive = true;
    quizState.score = 0;
    quizState.currentQuestion = 0;
    quizState.timeElapsed = 0;
    quizState.type = type;
    
    // Vygenerovat otázky
    const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
    quizState.questions = shuffled.slice(0, 10).map(word => {
        // Vygenerovat špatné odpovědi
        const wrongAnswers = vocabulary
            .filter(w => w.id !== word.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(w => w.czech);
        
        const options = [...wrongAnswers, word.czech].sort(() => Math.random() - 0.5);
        
        return {
            word: word,
            correctAnswer: word.czech,
            options: options
        };
    });
    
    quizState.totalQuestions = quizState.questions.length;
    
    // Zobrazit modal
    document.getElementById('quiz-modal').classList.add('active');
    document.getElementById('quiz-title').textContent = `Kvíz - ${getTypeName(type)}`;
    
    showQuestion();
    startTimer();
}

function getTypeName(type) {
    const names = {
        'recognition': 'Rozpoznávání',
        'writing': 'Psaní',
        'listening': 'Poslech'
    };
    return names[type] || 'Kvíz';
}

function showQuestion() {
    const question = quizState.questions[quizState.currentQuestion];
    
    document.getElementById('quiz-chinese').textContent = question.word.chinese;
    document.getElementById('quiz-score').textContent = quizState.score;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = question.options.map((option, index) => `
        <button class="quiz-option" onclick="checkAnswer(${index}, '${option.replace(/'/g, "\\'")}')">
            ${option}
        </button>
    `).join('');
    
    document.getElementById('quiz-feedback').innerHTML = '';
}

function checkAnswer(selectedIndex, selectedAnswer) {
    const question = quizState.questions[quizState.currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    
    // Zakázat další kliky
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    if (isCorrect) {
        options[selectedIndex].classList.add('correct');
        quizState.score += 10;
        document.getElementById('quiz-feedback').innerHTML = '<span style="color: #2ecc71;">✓ Správně! +10 XP</span>';
        addXP(10);
    } else {
        options[selectedIndex].classList.add('incorrect');
        // Najít a označit správnou odpověď
        const correctIndex = question.options.indexOf(question.correctAnswer);
        options[correctIndex].classList.add('correct');
        document.getElementById('quiz-feedback').innerHTML = `<span style="color: #e74c3c;">✗ Špatně! Správně bylo: ${question.correctAnswer}</span>`;
    }
    
    // Pokračovat po chvíli
    setTimeout(() => {
        quizState.currentQuestion++;
        
        if (quizState.currentQuestion >= quizState.totalQuestions) {
            endQuiz();
        } else {
            showQuestion();
        }
    }, 1500);
}

function startTimer() {
    clearInterval(quizState.timer);
    quizState.timer = setInterval(() => {
        quizState.timeElapsed++;
        document.getElementById('quiz-timer').textContent = quizState.timeElapsed;
    }, 1000);
}

function endQuiz() {
    clearInterval(quizState.timer);
    quizState.isActive = false;
    
    const percentage = (quizState.score / (quizState.totalQuestions * 10)) * 100;
    
    let message = '';
    if (percentage === 100) {
        message = '🎉 Perfektní výsledek!';
        appState.perfectScores++;
        addXP(50);
        addGems(10);
        checkAchievements();
    } else if (percentage >= 80) {
        message = '👏 Skvělá práce!';
        addXP(20);
    } else if (percentage >= 60) {
        message = '👍 Dobrý výkon!';
        addXP(10);
    } else {
        message = '💪 Zkus to znovu!';
    }
    
    document.getElementById('quiz-feedback').innerHTML = `
        <h4>${message}</h4>
        <p>Skóre: ${quizState.score}/${quizState.totalQuestions * 10}</p>
        <p>Čas: ${quizState.timeElapsed}s</p>
        <button class="btn-primary mt-20" onclick="closeQuiz()">Zavřít</button>
    `;
    
    appState.lessonsCompleted++;
    appState.dailyProgress++;
    saveState();
    updateUI();
}

function closeQuiz() {
    document.getElementById('quiz-modal').classList.remove('active');
}

// ==================== WRITING SYSTEM ====================

let canvas, ctx;
let isDrawing = false;
let currentWritingChar = null;
let drawingPath = [];

function initCanvas() {
    canvas = document.getElementById('character-canvas');
    ctx = canvas.getContext('2d');
    
    // Nastavení štětce
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Event listenery
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Touch support
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    isDrawing = true;
    drawingPath = [{
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    }];
    ctx.beginPath();
    ctx.moveTo(drawingPath[0].x, drawingPath[0].y);
}

function handleTouchMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    drawingPath.push({ x, y });
    ctx.lineTo(x, y);
    ctx.stroke();
}

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    drawingPath = [{ x, y }];
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    drawingPath.push({ x, y });
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingPath = [];
    document.getElementById('writing-feedback').innerHTML = '';
}

function updateWritingSelect() {
    const select = document.getElementById('write-character-select');
    select.innerHTML = '<option value="">-- Vyber znak --</option>' +
        vocabulary.map(word => `
            <option value="${word.id}">${word.chinese} (${word.pinyin}) - ${word.czech}</option>
        `).join('');
}

function loadCharacterToWrite() {
    const select = document.getElementById('write-character-select');
    const charId = select.value;
    
    if (!charId) {
        currentWritingChar = null;
        clearCanvas();
        return;
    }
    
    currentWritingChar = vocabulary.find(v => v.id === parseInt(charId));
    clearCanvas();
    
    // Zobrazit vzorový znak (světle šedý)
    drawTemplate(currentWritingChar.chinese);
    
    // Zobrazit postup tahů
    displayStrokeOrder(currentWritingChar);
}

function drawTemplate(character) {
    ctx.font = '200px Arial';
    ctx.fillStyle = '#ecf0f1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character, canvas.width / 2, canvas.height / 2);
}

function displayStrokeOrder(word) {
    const demo = document.getElementById('strokes-demo');
    // Pro zjednodušení zobrazíme jen počet tahů
    demo.innerHTML = `
        <div class="stroke-step" style="font-size: 1rem;">
            ${word.strokes} tahů
        </div>
    `;
}

function showHint() {
    if (currentWritingChar) {
        drawTemplate(currentWritingChar.chinese);
    }
}

function checkWriting() {
    if (!currentWritingChar) {
        document.getElementById('writing-feedback').innerHTML = 
            '<span style="color: #e74c3c;">Nejdříve vyber znak!</span>';
        return;
    }
    
    // Jednoduchá kontrola - zda něco nakresleno
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasDrawing = Array.from(imageData.data).some(pixel => pixel < 255);
    
    if (hasDrawing) {
        document.getElementById('writing-feedback').innerHTML = 
            '<span style="color: #2ecc71;">✓ Výborně! Pokračuj v procvičování.</span>';
        addXP(5);
        
        if (!appState.writingPractice.includes(currentWritingChar.id)) {
            appState.writingPractice.push(currentWritingChar.id);
            checkAchievements();
        }
        
        saveState();
        updateUI();
    } else {
        document.getElementById('writing-feedback').innerHTML = 
            '<span style="color: #e74c3c;">✗ Nakresli něco!</span>';
    }
}

// ==================== PRONUNCIATION SYSTEM ====================

let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];

function playTone(toneNumber) {
    const tone = tones[toneNumber];
    
    // Aktualizovat SVG cestu
    document.getElementById('tone-path').setAttribute('d', tone.path);
    document.getElementById('tone-demo-text').textContent = tone.example.split(' ')[0];
    
    // Přehrát zvuk (syntéza)
    speakWord(tone.example.split(' ')[0]);
}

function speakWord(word) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    } else {
        alert('Vaše prohlížeč nepodporuje syntézu řeči.');
    }
}

function toggleRecording() {
    const btn = document.getElementById('record-btn');
    const text = document.getElementById('record-text');
    
    if (!isRecording) {
        startRecording();
        btn.classList.add('recording');
        text.textContent = 'Nahrávám...';
    } else {
        stopRecording();
        btn.classList.remove('recording');
        text.textContent = 'Nahrát';
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = analyzeRecording;
        
        mediaRecorder.start();
        isRecording = true;
    } catch (err) {
        alert('Nepodařilo se získat přístup k mikrofonu. Prosím povolte přístup.');
        console.error(err);
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
    }
}

function analyzeRecording() {
    // Simulace analýzy (skutečná analýza by vyžadovala backend)
    const feedback = document.getElementById('pronunciation-feedback');
    const qualities = ['Výborně!', 'Dobře!', 'Zkus to znovu!', 'Skvělá výslovnost!'];
    const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
    
    feedback.innerHTML = `<span style="color: #2ecc71;">✓ ${randomQuality}</span>`;
    
    addXP(3);
    
    if (!appState.pronunciationPractice.includes(Date.now())) {
        appState.pronunciationPractice.push(Date.now());
    }
    
    saveState();
    updateUI();
}

function playNativeAudio() {
    const word = document.getElementById('speak-word').textContent;
    speakWord(word);
}

// Náhodné slovo pro výslovnost
function updateSpeakingWord() {
    const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    document.getElementById('speak-word').textContent = randomWord.chinese;
    document.getElementById('speak-pinyin').textContent = randomWord.pinyin;
    document.getElementById('speak-meaning').textContent = randomWord.czech;
}

// ==================== GAMIFICATION ====================

function addXP(amount) {
    appState.xp += amount;
    
    // Level systém
    const newLevel = Math.floor(appState.xp / 100) + 1;
    if (newLevel > appState.level) {
        appState.level = newLevel;
        showAchievementPopup('Nová úroveň!', `Dosáhl jsi úrovně ${appState.level}!`, '🎉');
        addGems(5);
    }
    
    saveState();
    updateUI();
}

function addGems(amount) {
    appState.gems += amount;
    saveState();
    updateUI();
}

function checkAchievements() {
    const newAchievements = [];
    
    achievements.forEach(ach => {
        if (appState.achievements.includes(ach.id)) return;
        
        let earned = false;
        
        switch(ach.id) {
            case 'first_word':
                earned = appState.wordsLearned.length >= ach.requirement;
                break;
            case 'ten_words':
                earned = appState.wordsLearned.length >= ach.requirement;
                break;
            case 'twenty_five_words':
                earned = appState.wordsLearned.length >= ach.requirement;
                break;
            case 'all_words':
                earned = appState.wordsLearned.length >= ach.requirement;
                break;
            case 'first_quiz':
                earned = appState.lessonsCompleted >= ach.requirement;
                break;
            case 'perfect_quiz':
                earned = appState.perfectScores >= ach.requirement;
                break;
            case 'five_day_streak':
                earned = appState.streak >= ach.requirement;
                break;
            case 'ten_day_streak':
                earned = appState.streak >= ach.requirement;
                break;
            case 'first_writing':
                earned = appState.writingPractice.length >= ach.requirement;
                break;
            case 'tone_master':
                earned = true; // Zjednodušeno
                break;
        }
        
        if (earned) {
            appState.achievements.push(ach.id);
            newAchievements.push(ach);
        }
    });
    
    if (newAchievements.length > 0) {
        newAchievements.forEach(ach => {
            showAchievementPopup(ach.title, ach.desc, ach.icon);
            addGems(5);
        });
        saveState();
    }
}

function showAchievementPopup(title, desc, icon) {
    const popup = document.getElementById('achievement-popup');
    document.getElementById('achievement-title').textContent = title;
    document.getElementById('achievement-desc').textContent = desc;
    document.querySelector('.achievement-icon').textContent = icon;
    
    popup.classList.add('show');
    
    setTimeout(() => {
        popup.classList.remove('show');
    }, 4000);
}

function renderAchievements() {
    const recentContainer = document.getElementById('recent-achievements');
    const allContainer = document.getElementById('all-achievements');
    
    if (appState.achievements.length === 0) {
        recentContainer.innerHTML = '<p class="empty-state">Zatím žádné úspěchy. Začni se učit!</p>';
    } else {
        const recentAch = achievements.filter(a => appState.achievements.includes(a.id)).slice(-3);
        recentContainer.innerHTML = recentAch.map(ach => `
            <div class="achievement-item" style="background: var(--background-color); padding: 15px; border-radius: 8px; text-align: center;">
                <div style="font-size: 2rem;">${ach.icon}</div>
                <h4 style="margin: 10px 0 5px;">${ach.title}</h4>
                <p style="font-size: 0.9rem; color: var(--text-secondary);">${ach.desc}</p>
            </div>
        `).join('');
    }
    
    // Všechny úspěchy
    allContainer.innerHTML = achievements.map(ach => {
        const earned = appState.achievements.includes(ach.id);
        return `
            <div class="achievement-item" style="background: ${earned ? 'var(--background-color)' : '#f0f0f0'}; padding: 15px; border-radius: 8px; text-align: center; opacity: ${earned ? 1 : 0.5};">
                <div style="font-size: 2rem;">${ach.icon}</div>
                <h4 style="margin: 10px 0 5px;">${ach.title}</h4>
                <p style="font-size: 0.9rem; color: var(--text-secondary);">${ach.desc}</p>
                ${earned ? '<span style="color: #2ecc71; font-weight: bold;">✓ Odemčeno</span>' : '<span style="color: #95a5a6;">🔒 Zamčeno</span>'}
            </div>
        `;
    }).join('');
}

// ==================== DAILY CHALLENGE ====================

function startDailyChallenge() {
    if (appState.dailyProgress >= appState.settings.dailyGoal) {
        alert('Gratuluji! Dnes jsi již splnil denní cíl! 🎉');
        return;
    }
    
    switchTab('vocabulary');
    startVocabQuiz('recognition');
}

// ==================== SETTINGS ====================

document.getElementById('daily-goal').addEventListener('change', (e) => {
    appState.settings.dailyGoal = parseInt(e.target.value);
    saveState();
    updateUI();
});

document.getElementById('sound-effects').addEventListener('change', (e) => {
    appState.settings.soundEffects = e.target.checked;
    saveState();
});

function resetProgress() {
    if (confirm('Opravdu chceš resetovat celý postup? Tato akce je nevratná!')) {
        localStorage.removeItem('cestinaCinstinaState');
        location.reload();
    }
}

// ==================== INITIALIZATION ====================

function initApp() {
    loadState();
    initCanvas();
    updateSpeakingWord();
    
    // První uvítání
    if (!appState.lastLogin) {
        showAchievementPopup('Vítej!', 'Začni svou cestu čínštinou!', '🐉');
    }
    
    console.log('Čeština-Čínština app initialized! 🇨🇿 → 🇨🇳');
}

// Spustit aplikaci po načtení stránky
document.addEventListener('DOMContentLoaded', initApp);

// ==================== GRAMMAR SYSTEM ====================

let currentGrammarLesson = null;

function renderGrammarLessons(category = 'all') {
    const container = document.getElementById('grammar-lessons-container');
    if (!container) return;
    
    let filtered = grammarLessons;
    if (category !== 'all') {
        filtered = grammarLessons.filter(l => l.category === category);
    }
    
    container.innerHTML = filtered.map(lesson => `
        <div class="grammar-lesson-card" onclick="openGrammarLesson('${lesson.id}')">
            <div class="lesson-header">
                <span class="lesson-level">Úroveň ${lesson.level}</span>
                <span class="lesson-category">${getCategoryName(lesson.category)}</span>
            </div>
            <h3>${lesson.title}</h3>
            <p class="lesson-preview">${lesson.explanation.substring(0, 100)}...</p>
            <div class="lesson-meta">
                <span>📝 ${lesson.examples.length} příkladů</span>
                <span>✏️ ${lesson.exercises.length} cvičení</span>
            </div>
        </div>
    `).join('');
}

function getCategoryName(cat) {
    const names = {
        'basics': 'Základy',
        'questions': 'Otázky',
        'particles': 'Částice',
        'numbers': 'Číslovky',
        'tenses': 'Časy',
        'comparison': 'Porovnání',
        'modals': 'Modální slovesa',
        'prepositions': 'Předložky',
        'time': 'Čas',
        'adverbs': 'Příslovce',
        'imperative': 'Rozkaz'
    };
    return names[cat] || cat;
}

function openGrammarLesson(id) {
    const lesson = grammarLessons.find(l => l.id === id);
    if (!lesson) return;
    
    currentGrammarLesson = lesson;
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'grammar-modal';
    modal.innerHTML = `
        <div class="modal-content grammar-modal-content">
            <div class="modal-header">
                <h2>${lesson.title}</h2>
                <button class="close-btn" onclick="closeGrammarModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="lesson-explanation">
                    <h3>📖 Vysvětlení</h3>
                    <p>${lesson.explanation}</p>
                </div>
                
                <div class="lesson-examples">
                    <h3>📝 Příklady</h3>
                    ${lesson.examples.map(ex => `
                        <div class="example-row">
                            <div class="chinese">${ex.chinese}</div>
                            <div class="pinyin">${ex.pinyin}</div>
                            <div class="czech">${ex.czech}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="lesson-exercises">
                    <h3>✏️ Cvičení</h3>
                    ${lesson.exercises.map((ex, idx) => `
                        <div class="exercise-item" data-idx="${idx}">
                            <p class="exercise-question">${ex.question}</p>
                            ${ex.type === 'fill' ? `<input type="text" class="exercise-input" placeholder="Doplň odpověď">` : ''}
                            ${ex.type === 'translate' ? `<input type="text" class="exercise-input" placeholder="Napiš překlad">` : ''}
                            ${ex.type === 'order' ? `<input type="text" class="exercise-input" placeholder="Seřaď slova">` : ''}
                            ${ex.type === 'choose' ? `
                                <div class="exercise-options">
                                    <label><input type="radio" name="ex${idx}" value="想"> 想</label>
                                    <label><input type="radio" name="ex${idx}" value="要"> 要</label>
                                    <label><input type="radio" name="ex${idx}" value="能"> 能</label>
                                </div>
                            ` : ''}
                            ${ex.type === 'match' ? `<input type="text" class="exercise-input" placeholder="Spáruj význam">` : ''}
                            ${ex.type === 'transform' ? `<input type="text" class="exercise-input" placeholder="Transformuj větu">` : ''}
                            <button class="btn-check" onclick="checkExercise(${idx})">Zkontrolovat</button>
                            <div class="exercise-feedback"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="completeGrammarLesson()">Dokončit lekci</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeGrammarModal() {
    const modal = document.getElementById('grammar-modal');
    if (modal) modal.remove();
    currentGrammarLesson = null;
}

function checkExercise(idx) {
    if (!currentGrammarLesson) return;
    
    const exercise = currentGrammarLesson.exercises[idx];
    const exerciseEl = document.querySelector(`.exercise-item[data-idx="${idx}"]`);
    const feedbackEl = exerciseEl.querySelector('.exercise-feedback');
    
    let userAnswer = '';
    if (exercise.type === 'choose') {
        const selected = exerciseEl.querySelector('input[type="radio"]:checked');
        userAnswer = selected ? selected.value : '';
    } else {
        const input = exerciseEl.querySelector('.exercise-input');
        userAnswer = input ? input.value.trim() : '';
    }
    
    if (userAnswer === exercise.answer) {
        feedbackEl.innerHTML = '<span class="correct">✅ Správně!</span>';
        addXP(10);
        addGems(5);
    } else {
        feedbackEl.innerHTML = `<span class="incorrect">❌ Špatně. Správně: ${exercise.answer}</span>`;
    }
}

function completeGrammarLesson() {
    if (!currentGrammarLesson) return;
    
    addXP(50);
    addGems(20);
    appState.lessonsCompleted++;
    
    // Zkontroluj achievementy
    if (appState.lessonsCompleted >= 1) {
        unlockAchievement('grammar_beginner');
    }
    if (appState.lessonsCompleted >= 5) {
        unlockAchievement('grammar_intermediate');
    }
    
    showNotification('Lekce dokončena!', '+50 XP, +20 diamantů');
    closeGrammarModal();
    updateUI();
}

// Event listenery pro gramatické filtry
document.addEventListener('DOMContentLoaded', () => {
    const grammarFilters = document.querySelectorAll('.cat-filter');
    grammarFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            grammarFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            renderGrammarLessons(filter.dataset.cat);
        });
    });
});

// ==================== PHRASES SYSTEM ====================

let currentSentenceIndex = 0;

function renderPhrases(category = 'all') {
    const container = document.getElementById('phrases-container');
    if (!container) return;
    
    let filtered = phrases;
    if (category !== 'all') {
        filtered = phrases.filter(p => p.category === category);
    }
    
    container.innerHTML = filtered.map(phrase => `
        <div class="phrase-card">
            <div class="phrase-situation">${phrase.situation}</div>
            <div class="phrase-chinese">${phrase.chinese}</div>
            <div class="phrase-pinyin">${phrase.pinyin}</div>
            <div class="phrase-czech">${phrase.czech}</div>
            <button class="btn-audio" onclick="speakPhrase('${phrase.chinese}')">🔊 Poslechnout</button>
        </div>
    `).join('');
}

function speakPhrase(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        speechSynthesis.speak(utterance);
    }
}

// Event listenery pro frázové filtry
document.addEventListener('DOMContentLoaded', () => {
    const phraseFilters = document.querySelectorAll('.phrase-filter');
    phraseFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            phraseFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            renderPhrases(filter.dataset.cat);
        });
    });
});

// ==================== SENTENCE PRACTICE ====================

function loadSentence() {
    if (sentences.length === 0) return;
    
    const sentence = sentences[currentSentenceIndex];
    document.getElementById('sentence-czech').textContent = sentence.czech;
    document.getElementById('sentence-input').value = '';
    document.getElementById('sentence-feedback').innerHTML = '';
}

function showSentenceHint() {
    const sentence = sentences[currentSentenceIndex];
    const hint = sentence.pinyin.split(' ').slice(0, 2).join(' ') + '...';
    document.getElementById('sentence-feedback').innerHTML = `<span class="hint">💡 Nápověda: ${hint}</span>`;
}

function checkSentence() {
    const sentence = sentences[currentSentenceIndex];
    const userInput = document.getElementById('sentence-input').value.trim();
    const feedbackEl = document.getElementById('sentence-feedback');
    
    if (userInput === sentence.chinese) {
        feedbackEl.innerHTML = `
            <span class="correct">✅ Správně!</span>
            <div class="sentence-result">
                <div class="pinyin">${sentence.pinyin}</div>
            </div>
        `;
        addXP(20);
        addGems(10);
        
        // Kontrola achievementu
        if (!appState.sentencesCorrect) appState.sentencesCorrect = 0;
        appState.sentencesCorrect++;
        if (appState.sentencesCorrect >= 10) {
            unlockAchievement('sentence_builder');
        }
    } else {
        feedbackEl.innerHTML = `
            <span class="incorrect">❌ Špatně.</span>
            <div class="sentence-result">
                <div class="correct-answer">Správně: ${sentence.chinese}</div>
                <div class="pinyin">${sentence.pinyin}</div>
            </div>
        `;
    }
    
    updateUI();
}

function nextSentence() {
    currentSentenceIndex = (currentSentenceIndex + 1) % sentences.length;
    loadSentence();
}

// Inicializace při načtení
document.addEventListener('DOMContentLoaded', () => {
    // Render gramatických lekcí
    renderGrammarLessons();
    
    // Render frází
    renderPhrases();
    
    // Načti první větu
    loadSentence();
});
