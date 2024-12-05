import * as services from "../services/organization";

export const getAllOrganization = async (req, res) => {
    try {
        const response = await services.getAllOrganizationService();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at organization controller: " + error,
        });
    }
};

export const deleteOrganization = async (req, res) => {
    const userId = req.user.id;
    const organizationId = req.query.id;

    try {
        if (!userId || !organizationId)
            return res.status(400).json({
                err: 1,
                msg: "Missing inputs",
            });
        const response = await services.deleteOrganizationService(
            organizationId
        );

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: "Failed at volunteer controller: " + error,
        });
    }
};
