程序的鲁棒性意味着你的程序在各种输入情况下都正常运转，讽刺的是，普通程序员水平有限，
为了顾着鲁棒性，可能使程序在重大漏洞的情况下还正常运行，从而变成了黑客的帮手，
有时候fail fast比鲁棒性更安全；

Robustness principle

"Be conservative in what you send, be liberal in what you accept"

Also known as "Postel's law" who wrote in TCP spec:
	"TCP implementations should follow a general principle of robustness: be conservative in what you do, be liberal in what you accept from others."

This is actually terrible for security!

"A flaw can become entrenched as a de facto standard. Any implementation of the protocol is required to replicate the aberrant behavior, or it is not interoperable. 
This is both a consequence of applying the robustness principle, and a product of a natural reluctance to avoid fatal error conditions. 
Ensuring interoperability in this environment is often referred to as aiming to be 'bug for bug compatible'." - Martin Thomson