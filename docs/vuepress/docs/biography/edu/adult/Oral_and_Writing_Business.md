## General

### Business Result - Upper-intermediate Student's Book
rapport
renowned

### 电话/会议
I was talking on the phone and suddenly got disconnected.

### Business Terms
CAPEX abbr. 资本支出（capital expenditures）
value proposition 企业或产品通过独特价值吸引客户的策略性陈述
	A strong ‌value proposition‌ clearly communicates how your product solves customers' pain points better than competitors.（强大的价值主张需清晰传达产品如何优于竞品解决客户痛点。）
touch points 强调用户与企业、品牌或产品产生互动的具体节点（如广告、客服、产品界面等）
	Effective marketing strategies require mapping all customer ‌touch points‌, from social media ads to post-purchase follow-ups.（有效营销策略需规划所有客户触点，涵盖社交媒体广告至售后跟进。）
	
steering group 指导小组/steering committee 指导委员会
  - a committee that decides on the priorities or order of business of an organization and manages the general course of its operations.
  The steering committee has approved the revised budget for next quarter.‌（‌指导委员会‌已批准了下季度的修订预算。）
  Professor Lee chairs the steering group responsible for curriculum updates.‌（李教授负责领导课程更新的‌指导小组‌。）

increase visibility into operational efficiencies and bottlenecks
improve customer service and retention

geographic expansion / corporate expansion
  Geographic expansion increases operational costs but diversifies revenue streams
  The CEO prioritized corporate expansion through acquisitions
immune to industry hype 对行业炒作免疫

seed budget 
  The startup allocated a ‌seed budget‌ to prototype development.（初创公司为原型开发分配了‌启动预算‌。）
blow budget
  Unexpected costs ‌blew the budget‌ for the marketing campaign.（意外开销‌超出‌了营销活动的‌预算‌。）

Staying relevant
  Staying relevant means finding new ways to offer added value, support the team, and contribute. The world is a competitive jungle and unless you **dial in on** how you can differentiate your company or skill set, Darwin's evolutionary theory will have some real personal meaning
  happy path
  保持竞争力‌意味着不断探索新的方式‌提供附加价值‌、‌支持团队‌并‌做出贡献‌。世界如同一个‌竞争丛林‌，若不能‌明确制定‌如何使企业或技能脱颖而出，达尔文的进化理论将对个人产生‌现实意义‌。‌顺境之路‌

buy in 入股参与或理念认同
	The venture capital firm aimed to ‌buy in‌ 30% of the company’s shares, but eventually chose to ‌buy out‌ the entire business.（风投公司原计划购入30%股权，但最终决定全资收购。）
buy out 全面收购或终止关系
	Lack of employee ‌buy-in‌ often leads to failed reforms, whereas a hostile ‌buy-out‌ may trigger legal battles.（员工缺乏认同常导致改革失败，而恶意收购可能引发法律纠纷。）
upsell 劝说购买更昂贵或更多商品
	The waiter tried to ‌upsell‌ customers by suggesting a larger drink for an extra $2.
crosssell 推荐相关或互补商品
	E-commerce platforms use AI to ‌cross-sell‌ items based on browsing history.

Thermal coal 热煤
coking coal 焦煤
Market Relevance 市场相关性
	指产品或服务与当前市场需求、竞争环境或消费者需求的匹配程度，侧重战略层面的适配性
Strong demand from China and India still makes Indonesian grades more relevant due to their cost efficiencies.
来自中国和印度的强劲需求，仍使印尼（产品）品级因其成本效益更具市场相关性
Indonesia’s renewable energy research ‌makes its coal grades more relevant‌ in Asian markets despite environmental concerns。
（尽管存在环境争议，印尼的可再生能源研究使其煤炭品级在亚洲市场更具相关性。）

Freight vs. Cargo‌：
Freight 强调运输过程及费用，Cargo 侧重货物本身属性；
‌Freight vs. Shipping‌：
Shipping 特指海运，Freight 覆盖多运输模式

subdued demand 需求不旺
"growing steel demand in india and southeast asia offers some support, but may not fully offset potential moderation in China"
可译为：
‌“印度及东南亚地区钢铁需求的持续增长提供了一定支撑，但可能无法完全抵消中国市场需求潜在放缓的影响。”

### business sentence
Light provisioning will be provided 
在航空、航海、技术文档等高度标准化的领域，沟通的首要原则是清晰、客观、避免歧义。使用被动语态能将注意力集中在关键的动作或状态上。例如，在航空通信中，说“The landing gear was extended”（起落架已放下）比“The pilot extended the landing gear”（飞行员放下了起落架）更简洁、焦点更突出。它弱化了个人因素，强调标准程序已被执行这一事实本身。
​ 如果使用 “is going to be provided”，会隐含一种“（我们）打算/计划提供灯光”的意味。这会给通知带入一丝“主观意图”的色彩，仿佛这个决定是某个操作员临时起意或系统刚刚计划好的，反而削弱了通知作为既定程序的确定性和可靠性 。
### business dialogue

Summary of the Issue:

The root cause is not a bug in your Java program itself, but a mismatch between the CSV data format and Excel's automatic interpretation.​ The problem is triggered by Excel's behavior, and the Java program's output can contributeto the confusion.

Detailed Explanation:
  + CSV Files are "Dumb" Text:​ Your Java program correctly writes data to the CSV file as plain text strings (e.g., "07:50:00", "2026-02-02 15:55:00"). A CSV file does not contain any formatting rules.
  + Excel's "Smart" & Problematic Guessing:​ When you open a CSV file directly in Excel (e.g., by double-clicking it), Excel tries to be helpful by automatically guessing the data type for each column. It scans the first few rows to decide. If the first rows contain strings that look like standalone times (e.g., "07:50:00"), Excel may incorrectly classify the entire columnas a Time​ data type. It then applies a Time-only number format (like mm:ss.0), which is why you see 55:54.0—the underlying full datetime value is being displayed as if it were only a duration of minutes and seconds, hiding the date portion.
Solutions:

A. For Immediate Fix (Handling Existing Files in Excel): select column, right click, format, custom
B. For a Permanent Fix (Java Program Best Practice):

Modify the Java program's export logic to write consistently and unambiguously formatted​ datetime strings. The most reliable standard is ISO 8601​ format.

Format:​ "yyyy-MM-dd'T'HH:mm:ss"(e.g., 2026-02-02T07:50:00)

Why it works:​ This is an international standard. Excel and other tools recognize it clearly as a full date and time, drastically reducing the chance of misparsing. Ensure everyrow in that column uses this complete format.

The display error is Excel's fault​ for applying an incorrect number format based on its automatic guess. However, you can prevent this guesswork​ by ensuring your Java program exports datetime values in a uniform, unambiguous, and complete ISO 8601 format. This is a data formatting best practice, not a bug fix.

remind you / give you a reminder 更直接、通用，是标准表达

give you a nudge 更随意、温和，像朋友间的悄悄话 非正式沟通，如同事、朋友间温和催促
  Just a friendly nudge—don’t forget to submit your report by Friday!
give you a heads up
  Give me a heads up if you’re running late—we don’t want to start without you.

Here are the updates:

1. The iOS app has been recreated. However, the release is currently pending the renewal of our iOS Developer Account.
2. Regarding the Google Play Store, there are new requirements for new app releases. The vendor estimates it will take about two days to make the necessary fixes.
3. For the APK direct download on our website, I will upload the file tomorrow once my access ticket is approved.

Hi Andrew, quick heads up—TOM mentioned we’re probably launching an ETH perpetual contract soon (still not 100% confirmed though). He suggested I reach out to you about the tool I shared with JACK last time—it might just need some config tweaks. I think UAT’s already been tested, so I just need your double-check to be sure. Just wanted to give you a nudge so you don’t forget when you’re back. Let me know if you need any details in the meantime! Thanks.

Hi team, could you help with this Google Maps profile issue?

**First off**(“off”在这里是虚词，无实际词汇意义，主要用于加强语气，使“first”的表达更口语化、更自然。类似的用法还有“right off”（立刻）、“straight off”（直接），其中的“off”均不承担具体语义，仅起到强化表达效果的作用。), I’m not sure who created this Google Maps profile **or** which account was used—if anyone recognizes the account, can you just log in with it and hit "edit profile"? That’s the easiest way to sort this out.

If no one knows the original account, another option is to use the "suggest and edit" function (I circled it in red here). But heads up—using a Google account linked to our business is better for this. Right now, the only account I have access to is xx@xxx.com. Do you have a more appropriate business-linked account we can use instead?

A: Hi @xxx , need help on xxx. Sorry, i couldn't find a xxx chat group. 
B: Sure, what's the specific issue? / Okay, could you please describe the problem? / Certainly. Could you please provide more details about the problem?

A：I have made the payment, have you received it? (attached a screenshot)
B: the picture you send is blur ,Pls send us clear picture
A: ok wait, i made a mistake
B: Hey! Wanted to follow up on the payment screenshot. The last one **came through** a bit blurry, so we couldn't **make out** the details. If you need any help with the process, just give me a shout

  说 “The last one came through a bit blurry” 将问题归结于“传送过来”的状态，比直接说 “The screenshot you sent is blurry”（你发的截图是模糊的）听起来更委婉，对方更容易接受。这是一种常见的商务沟通技巧

  ”make out“ 暗示你已经尝试去辨认了，但确实因为清晰度问题而失败。这比简单的 “I can’t see” 更能说明问题所在，并促使对方提供更清晰的信息。

Our PM gave us a heads-up​ at the last meeting​ that all our systems may need to support 24/7 operation​ in the future, following new investment. Each system owner now needs to evaluate the manpower required, determining whether we should develop in-house​ or purchase a new system​ to meet this requirement. 

Could you please provide the high-resolution original image? I'd like to use it for the banner and would appreciate it if the brightness could be adjusted to match our other banners.

ok you need it by today？
Yes, please. If you could, that would be great. Thank you!

Hi xxx, our website vendor has sent the invoice and it's now in our internal processing stage. Could you kindly confirm if the approval flow is as follows:

1. Obtain approvals from​ Finance , and LCD 

2. Then initiate Annex A signing​ by the same parties

Is this correct?

Hi [Name], quick question on the Annex A signing sequence: Should Finance sign after Tom has signed, or should LCD sign first?

Hi Peter, my colleague was curious about the rationale behind upgrading to the new version. I mentioned it's a best practice for security and performance, but would you have any additional insights to share?

Hi Peter, gentle reminder on the upgrade rationale! If no further comments are needed, we’ll finalize this as the official explanation.

Hey xxx, free to sync on the haircut logic later? Want to ensure I'm on the right track.

so is the new product already returned from api?
Yes, but typically only after the product is officially launched. APIs usually connect to the production database, so only data from launched products is accessible through the API.

All APIs will return complete data when available. For testing, ensure the testing API environment is fully populated with the required data (there seems to be a gap in data handover from Bob to me). For production, data will only be accessible after the official launch.

Hi team, I've identified a gap in the data handover from peter to me. To resolve this, could you confirm whether Bob had set up the testing API for you yesterday? This will help me ensure data continuity and proper configuration.

Based on this, it appears testing APIs were never utilized from the outset. Let me also search through document backups to verify if any testing APIs existed previously.

I would like to schedule a brief meeting later today to provide an update on the CAMT053 test. Please let me know what time would be convenient for you.

This is to confirm that the settlement price displayed on a Monday (before 7:00 PM) should be the one from the previous Friday.

The 'Accounts' category in the Excel file appears to be empty. What is the best way to verify its accuracy, regardless of whether it contains data or is supposed to be blank?

touch base vs discuss
    Would it be possible to connect briefly today at your convenience to discuss the clearing repository permissions?
    do you have a few minutes today to touch base on the clearing repo permissions? Thanks!

Is UAT testing performed in a test environment? If yes, how is the test environment maintained and how does APEX make sure it represents the production environment at the time of testing?

"To my knowledge, there is no test environment. You should probably confirm with the Finance Department or the person who purchased this service. As far as I know, Yonyou provides their service by having users log into their system. All services are offered by Yonyou and are not hosted on our end."


Are there scheduled jobs / batch jobs set up within the Yonyou application?

If applicable, please provide details of the scheduled jobs in the system showing the job names and frequencies.

"To my knowledge, no scheduled or batch jobs are configured on our end. If you are referring to business-process-related jobs (e.g., financial closing, automated reports), I recommend confirming with the Finance Department, as the IT team only manages user access and does not handle business-domain configurations.

If your question pertains to scheduled jobs on Yonyou’s side (such as system backups or data synchronization), note that these are fully managed by Yonyou. Their internal processes are not visible to us, so we do not have details regarding job names or frequencies."

### business email
hi team, kindly acknowledge the email and whether there are any patches for your systems. Please use the attached form to identify and assess vulnerabilities or patch updates under your care. 
< Noted, thanks. Our website doesn't use [XX Plugin] or [XX Theme], so we're unaffected.

Hi xxx,

The iOS Developer Account (Account ID: [Insert Account ID if applicable]) for our mobile app project has expired. Vendor needs to use this account to publish a new app, so we have to renew it. Seeking your approval. Thanks.

Dear [HOD's Name],

I am writing to seek your urgent approval for emergency changes made to the TESTAPI to resolve the OI display issue on the website/chart page.

Upon investigation, I identified that the issue was caused by a code discrepancy in the TESTAPI server. The project was originally developed by Bob, and the deployed code had not been updated since his departure. It is unclear why the production code was inconsistent with the GitLab repository.

I have now corrected the code to align with the repository and ensure consistent functionality. The fix has been documented in the following Jira ticket for your reference:

www.xxx.com/ddd

Could you please approve this emergency change at your earliest convenience? Should you require additional details or discussion, I am available for a quick call or meeting.

Thank you for your support.


hi xxx, could you assist to check and provide the following: xxxxx 
<=Please find the requested [specific document, e.g., report, quotation] attached as requested.

hi xx, the xxx account has an oustanding balance of xxx on invoice xxx tht is now 55 past due..... 
<=
Hi [Recipient's Name],

Thank you for your email. We have reviewed the outstanding balance mentioned for Invoice [Invoice Number] and would like to clarify that our records indicate this invoice was fully paid last year upon renewal, and the associated license remains active.

To help resolve this discrepancy, we have provided details below:

Invoice Number: [Invoice Number]

Payment Date: [Specify the exact date of payment]

Payment Method: [e.g., Bank Transfer/Credit Card]

Transaction ID/Reference: [Include the specific payment reference number]

License Period: [Effective Date] to [Expiration Date], confirming current validity.

Could you please verify the status at your end and confirm if the payment was possibly misapplied or if there is any missing documentation on our side? We are happy to provide additional proof of payment or cooperate closely to resolve this quickly.

We appreciate your prompt attention to this matter and look forward to your update.

Best regards,

hi xxx, 
we refer to the Maintenance Package received. Gratefu if you could kindly confirm that Mr. peter is a director of xxx Pte.Ltd. and has the authority to enter into the agreement on behalf of the company. Where relevant, please also share supporting documentation for our records.
<=
Dear peter,

I am forwarding the request from our Legal Department below regarding confirmation of your directorship and signing authority. Could you kindly reply directly (with Legal copied) to clarify and provide the necessary supporting documentation?
<=
Dear [Legal Team],

I confirm that Mr. peter  is a duly appointed director of xxx Pte. Ltd. and is authorized to enter into agreements on behalf of the company.

For your records, please find attached a copy of the latest [BizFile / Company Business Profile from ACRA] reflecting his directorship.

Hi [Name],

I have no further comments on this./This looks good to me—no further comments from my side. Thanks!

Thank you!

[Your Name]

---

Thanks for the update.​ I wasn't included on the earlier emails, so let me review the thread first to get up to speed. I'll then connect with Bob next Monday to discuss it.

Thank you for filling me in.​ As I wasn't copied on the previous correspondence, I will need to go through the email history to fully understand the situation. I plan to discuss this matter with Bob next Monday and will follow up with you thereafter.

---

Hi [Name],

I've added the new banner and timeline as requested. For the images, I've reused what was available in our media library. Please let me know if you'd like to change them.

Also, for the FX timeline, the text appears a bit too long and is overflowing the current design.

Best,

[Your Name]
---
Dear [Recipient's Name],

I hope this email finds you well.

Could you kindly review and approve the ​2025 Website Maintenance Contract​ along with the attached invoice at your earliest convenience? Please let me know if you need any additional details.

Thank you for your time and support.

Hi [Name],

Seeking your approval on the ​2025 Website Maintenance Contract​ and attached invoice. Let me know if you need any changes.

---
Subject:​​ Re: Authorization Clarification for Annex A Sign-off

Kindly note that Richard is not authorized to act in the capacity of CFO and sign off the Annex A.

Currently the official CFO designation rests with our CEO, Peter.

Regards,
Tom

Hi Tom,

Thank you for the clarification. Noted that ​Peter (CEO)​​ remains the designated approver for Annex A in the absence of an official CFO.

We’ll ensure to route the document to him for signing. Appreciate your guidance!

---

Hi [Name],

Thank you for the clarification. I was just about to reach out to Nelson, but I’ll hold off and wait for Finance to follow up on the remaining steps.

Appreciate your guidance!

Hi Peter,

Thank you for sharing this—much appreciated!

Hi [Name],

Thanks for sending these documents over. I've reviewed the attachment and everything looks in order.

Appreciate your help!

---
Hi [Name],

The LCD team has reviewed the quotes, invoice, and our existing ​Master Service Agreement. The vendor has already revised the invoice per peter's comments.

Could you please ​sign Annex A​ at your earliest convenience? Let me know if you need any additional details.

Thanks for your support!

Dear Finance Team,

Please find attached the signed documents for your reference. Kindly proceed with the payment arrangement at your earliest convenience.

Thank you for your assistance.

Hi [Name],

May I postpone the update to tomorrow? I need Infra's assistance to whitelist my IP for admin page access, but they're on leave today.

Let me know if this works for you.

Dear [Name],

I've completed the update as requested. Please review at your convenience and let me know if any adjustments are needed.

---

Hi [Manager's Name],

The attached invoice is due soon, and the vendor has followed up for payment.

Could you please review and approve it at your earliest convenience?

Thank you,

[Your Name]

“has followed up” (现在完成时) 在商务沟通中通常比 “is following up” (现在进行时) 更专业、更常用

​视角​：强调 ​动作的完成及其对现在的影响。它表达的意思是“供应商已经跟进过了（这个动作完成了），而我们现在收到了这个信息，需要处理它”。

​隐含意义​：关注的是“跟进”这个事实本身，以及它给我们带来的结果（即我们需要行动）。它听起来像是一个客观的、已经发生的事件陈述，为我们的请求提供了一个中立的理由。

The vendor is following up. (现在进行时)​​

​视角​：描述 ​当前正在发生的动作。它表达的意思是“供应商此刻正在跟进”。

​隐含意义​：这会给人一种“供应商正在紧盯着我们”的紧迫感，甚至可能带有一丝被催促的压迫感。在某些情况下，可能会被解读为你在向经理传递压力。

## Specific Area
### film narrative and visual composition 影视叙事
​旁白​ Voice-over
画中画 Picture-in-Picture (PIP)
独白​ Monologue / Interior Monologue
字幕​ Subtitle / Caption
情节 Plot 次要情节 Subplot
分屏​	Split Screen
切出镜头/插入镜头 cutaway
特写 Close-Up (CU)​​
中景 Medium Shot (MS)​
远景/全景 ​Long Shot (LS) / Wide Shot (WS)​
俯拍镜头 High-Angle Shot
仰拍镜头 Low-Angle Shot
推位摄影/跟踪镜头 ​Tracking Shot
Montage An editing technique that combines a series of short shots to condense space, time, or information. Specific types include ​Accelerated Montage​ (to increase tension) and ​American Montage​ (often to show the passage of time or a summary of events) 
.

### About banking
整存整取、零存整取和定活两用 3g.en8848.com.cn/hangye/bank/voadh/146480.html
### About Investment/Banking


encumbered assets 抵押资产
免除信用卡年费 waive credit card annual fee
还信用卡钱 settle/pay credit card bills

交通卡Fare Card for bus and train journeys 月票 Price for all existing monthly concession passes remain unchanged.
tap fare card tap in tap out
swipe credit card
scan fingerprints scan in scan out
speculate vs hedge vs invest vs infer
  The main purpose of speculation, on the other hand, is to profit from betting on the direction in which an asset will be moving. Hedgers reduce their risk by taking an opposite position in the market to what they are trying to hedge.
  The main difference between speculating and investing is the amount of of risk undertaken in the trade. Typically, high-risk trades that are almost akin to gambling fall under the umbrella of speculation, whereas lower-risk investments based on fundamentals and analysis fall into the category of investing.
  As verbs the difference between speculate and infer is that speculate is to think, meditate or reflect on a subject; to consider, to deliberate or cogitate while infer is to introduce (something) as a reasoned conclusion; to conclude by reasoning or deduction, as from premises or evidence.

### About Start up Business/Entrepreneurship

A sudden spike in interest in 'Green' options has taken us by surprise, how to offer energy efficient models, and still manage our legacy inventory.
市场对“绿色”选项的兴趣激增令我们措手不及，如何在提供高能效产品的同时妥善处理传统库存？legacy inventory‌ 指因技术迭代或政策变化滞销的传统产品（如燃油车、非智能电器）

Don't lose sight of the business plan you created, among the cross-currents of internal politics and group management.
在内部政治与团队管理的暗流中，切勿忽视你制定的商业计划 cross-currents暗流

The driver is a stronger organization that can deliver ever increasing benefits.
核心驱动力在于构建能持续创造增效的强大组织架构

+ Business Premise:
  Definition: The term encompasses the entire physical location or property where business activities take place. This can include offices, retail stores, warehouses, factories, and more.
  Usage: It’s a general term that applies to any property used for business purposes. For example:
  "Our business premise is located in downtown." (This could refer to any type of business location, whether an office, store, or factory.)
+ Office:
  Definition: An office specifically refers to a space where administrative, clerical, or professional work is conducted. It’s a subset of business premises.
  Usage: The term "office" is used when talking about a workspace for employees to conduct business activities such as meetings, paperwork, or client interactions. For example:
  "We need to renovate our office to accommodate more staff."

**discount <-> mark-up**

A store buys a shirt for $50 from a supplier. They apply a 50% mark-up, meaning they increase the price by 50% of the cost price.

Wholesale warehouse sale retail
尾货 Wei Huo is the normal order of foreign trade surplus goods.
merchandise / goods

### About Employ

to tender one's resignation（提交辞呈）to tender one's thanks（致以谢意）to tender an apology（致歉）to tender for a contract（为一份合同投标）
The company submitted a tender for the construction project.（该公司为那个建设项目提交了一份标书。）

Peter has tendered his resignation. There will be an interview to find his replacement.或 Peter has resigned. They will hold interviews to replace him.

Retrenchment Benefits 辞退费
**in your line of work**
the word "line" refers to a specific field, occupation, or area of expertise. It's a commonly used expression to talk about someone's profession or the kind of tasks they regularly perform in their job.
Example:
"In your line of work, you probably deal with a lot of clients."
This means: In your profession (e.g., sales, law, medicine), you likely interact with many clients.

**in the course of your work**
+ "Course" generally refers to the path or direction something takes over time. It emphasizes the flow or sequence of events or actions.
  Example: In the course of your work (the path your work takes over time or as part of the job).
  Emphasis: The journey, events, or timeline.
+ "Process" refers to a systematic series of actions or steps taken to achieve a specific end. It focuses more on the structured actions or stages that lead to a result.
  Example: In the process of completing your work (the steps involved in getting the work done).
  Emphasis: The structure, method, or stages involved.

compel compulsory
retrenchment
He said such benefits should apply to all staff, including professionals, managers, executives and technicians (PMETs) and management. Currently, retrenchment benefits are determined by agreements between employers and employees.
Mr Lim also suggested that the retrenchment benefit law should compel companies to pay a minimum sum of between three and six months of benefits, depending on the employee's length of service.
--http://www.channelnewsasia.com/news/singapore/make-retrenchment/2667720.html?cx_tag=undefined&cid=tg:recos:undefined:standard#cxrecs_s
http://www.forbes.com/sites/lizryan/2016/04/07/did-this-employee-take-work-life-balance-too-far/#14d119415c42
http://www.forbes.com/sites/lizryan/2016/04/07/did-this-employee-take-work-life-balance-too-far/#14d119415c42
http://sbr.com.sg/hr-education/news/over-6-in-10-local-firms-have-mentally-absent-employees-says-survey
working remotely www.techrepublic.com/blog/10-things/10-good-reasons-why-working-remotely-makes-sense/

裁员 chop cut 罢工

transit strike 公交罢工

### About politics
doctrines 教义 教条
law enforcement
appreciation depreciation
belittle
bifurcate
bilateral matter
crony 裙带关系
civil
decency
derail
dissenter
dismantle
deficit
domestic

erratic
implication
injunction
indigenous 本土的
legislation
judiciary
offshored
overreach
overhear
non-parties
peasent
proverbial
provoke
resilient
resolute
relegate
reciprocate
retaliatory

succumb
spook
ultimatum
uphold
vigilant
viligantes
Zeitgeist

tip of the spear
yield back

what's the US reaction to xxx's remarks
tit to tat
quote unquote
coopetition 合作竞争
omnichannel 全渠道
convertible debt 可换债务;
well oiled  (especially of an organization) operating smoothly."the ruling party's well-oiled political machine" 2.informal drunk."I was pretty well oiled that evening"

peninsular
play out
    商务/政治领域‌：表示事件逐步展开或谈判进程演变，强调动态性。
    牛津词典典型例句："The trade tensions will play out over the next fiscal quarter."
    实际应用例句（结合搜索结果）："The U.S.-EU trade talks may play out differently depending on tariff adjustment timelines"

to come
    与 "yet" 连用强调未完成的未来事件
    The crucial phase of negotiations ‌is yet to come‌."（谈判的关键阶段尚未到来）
    后置定语成分 修饰名词，强调时间延续性和未来性
    Economic policies ‌for years to come‌ must address climate risks."（未来数年的经济政策需应对气候风险）

optics‌ 舆论形象 公众形象
  I think the optics here are terrible and the first shoe to drop is going to be gobsmacking realization on the part of a lot of regular Americans that this university is already stitting on 54 billion dollars
  "我认为此事的公众观感极差，而首当其冲的冲击将是许多普通美国人震惊地意识到——这所大学已经坐拥540亿美元资金
nationalism

narrative
treaty
due consultation
	subject to approval after due consultation with the Member State”官方译文：“‌经与会员国协商后‌报批”（联合国文件）

hostile

law enforcement
#### ideology
white supremacy
dei diversity/equity/inclusion 

zionist

#### economic
tax exempt status

#### war
arsenal 兵工厂 军械库
bunker
theater of war 战区
missile
massacre
reservist 预备役军人英 [rɪˈzəːvɪst]
surgical strike 外科手术式打击
wreckage


monopoly on electronic warfare supremacy 对电子战优势的垄断
radar 
warfare
A launch command, vetted by an AI fire control system, initiated the flight of a sleek, ramjet-powered Chinese missile streaking through the upper atmosphere toward a French-built aircraft. This event signified the crumbling of a long-standing assumption: that no non-Western air force could successfully deploy its indigenous weapon systems in real combat to challenge a frontline NATO-standard fighter.


#### religion
cult
priest 神父
catholic 天主教
inshallah 真主保佑

US CHINA
discriminate discrimination
discrete discretion
monopoly
Discrimination is the prejudicial treatment of individuals based on their membership,
or perceived membership, in a certain group, such as race, ethnicity, religion, skin color, etc.
It involves the group's initial reaction or interaction,influencing someone's behavior toward the group,
restricting members of one group from opportunities that are available to another group, leading to
the exclusion of the individual or group based on logical or irrational decision making.
--<<the dragon network>> https://books.google.com.sg/books?id=budNEqARJBAC&pg=PT13&lpg=PT13&dq=dragon+network+malaysia++policy&source=bl&ots=rKvDXCLePd&sig=FowsTDzSgumwa8e_2Wtvr56kZ20&hl=en&sa=X&ved=0ahUKEwiohdexlPXLAhVIHY4KHe56BdEQ6AEIGjAA#v=onepage&q=dragon%20network%20malaysia%20%20policy&f=false
North Korea (officially known as the Democratic People’s Republic of Korea, or DPRK) has owned the title of “Most Worthless Government on Earth” for decades. It owes that title to many things; one of them is its monopoly on the information to which its citizens have access. (Others include things like imprisoning and executing dissidents.)
--https://www.yahoo.com/tech/new-use-for-old-flash-1393496814829622.html
http://www.businessinsider.sg/china-lost-500-billion-in-reserves-in-2015-2016-5/?r=US&IR=T#.VzvR3dV96Um
 
about China
Here’s how China managed to lose $500 billion in reserves in one year Read more at http://www.businessinsider.sg/china-lost-500-billion-in-reserves-in-2015-2016-5/#YsTShVu1vIKBlIaj.99 www.businessinsider.sg/china-lost-500-billion-in-reserves-in-2015-2016-5/?r=US&IR=T#.Vy1BfKMRXqC#s70t9uuYAh30CGLr.97
Hundreds of Chinese parents who lost their only child are now demanding compensation www.businessinsider.com/r-hundreds-of-bereaved-chinese-protest-over-one-child-compensation-2016-4?IR=T&r=US&IR=T
China's startup investment fund is bigger than the entire GDP of Denmark www.businessinsider.com/chinas-startup-investment-fund-is-bigger-than-denmarks-gdp-2016-4?IR=T&r=UK&IR=T
China plans to tear down walls of gated condos and let public in www.theedgemarkets.com/article/china-plans-tear-down-walls-gated-condos-and-let-public
China’s missile gambit https://www.washingtonpost.com/opinions/chinas-missile-gambit/2016/02/21/fc87c29a-d746-11e5-9823-02b905009f99_story.html?utm_term=.b9331253c0d1

territory region protectorate state  http://english.stackexchange.com/questions/3572/what-are-province-territory-protectorate-state


### About Society
[sexual harassment](http://www.un.org/womenwatch/osagi/pdf/whatissh.pdf)
human dynamics 
	社会学研究‌：分析群体行为（如“‌human dynamics‌ in crowd behavior analysis”）。
	‌企业管理‌：优化团队协作（如“manage ‌human dynamics‌ to boost productivity”）。
	‌人工智能‌：模拟人类交互（如“model ‌human dynamics‌ in virtual environments”）

judge（法官）和 jury（陪审团）

general public
common good 
	Policymakers should prioritize the ‌common good‌ over individual interests.（决策者应优先考虑‌公共利益‌而非个人利益。）
	Sacrificing personal gains for the ‌common good‌ is a core value in many cultures.（为‌共同利益‌牺牲个人利益是许多文化的核心价值。）

mega trend 大趋势”或“重大趋势”
  The shift toward multipolar globalization reflects a ‌mega trend‌ of geopolitical realignment.（多极化全球化的转向体现了地缘政治格局重构的‌重大趋势‌。）
### About shipping

seaborne 海运

